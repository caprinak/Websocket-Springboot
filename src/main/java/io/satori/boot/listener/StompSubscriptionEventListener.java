package io.satori.boot.listener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class StompSubscriptionEventListener {

    private static final Logger log = LoggerFactory.getLogger(StompSubscriptionEventListener.class);

    private static final String NOTIFICATION_HASH_KEY_PREFIX = "notification:";
    private static final String USER_NOTIFICATIONS_ZSET_KEY_PREFIX = "user:notifications:";

    // Regex to find a user ID in a destination like "/user/123/queue/enrollments"
    private static final Pattern USER_DESTINATION_PATTERN = Pattern.compile("^/user/([^/]+)/");

    private final RedisTemplate<String, String> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;


    public StompSubscriptionEventListener(RedisTemplate<String, String> redisTemplate,
                                          SimpMessagingTemplate messagingTemplate,
                                          ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        String userIdStr = null;
        Principal userPrincipal = event.getUser();

        // Priority 1: Use the authenticated principal if it exists (the correct long-term approach)
        if (userPrincipal != null && userPrincipal.getName() != null) {
            userIdStr = userPrincipal.getName();
        }

        String destination = (String) event.getMessage().getHeaders().get("simpDestination");

        // Priority 2: If no principal, try to extract the ID from the destination path for simulation
        if (userIdStr == null && destination != null) {
            Matcher matcher = USER_DESTINATION_PATTERN.matcher(destination);
            if (matcher.find()) {
                userIdStr = matcher.group(1); // The captured group (e.g., "123") is the user ID
                log.info("Extracted simulated userId '{}' from destination path.", userIdStr);
            }
        }

        if (userIdStr != null) {
            log.info("User {} subscribed. Checking for pending notifications in Redis.", userIdStr);
            sendPendingNotifications(userIdStr);
        } else {
            log.warn("Could not determine user for subscription to destination: {}", destination);
        }
    }

    private void sendPendingNotifications(String userIdStr) {
        String userNotificationsKey = USER_NOTIFICATIONS_ZSET_KEY_PREFIX + userIdStr;

        // Fetch all notification IDs from the user's sorted set, ordered by score (time)
        Set<String> notificationIds = redisTemplate.opsForZSet().range(userNotificationsKey, 0, -1);

        if (notificationIds == null || notificationIds.isEmpty()) {
            log.info("No pending Redis notifications for user ID: {}", userIdStr);
            return;
        }

        log.info("Found {} pending notifications for user ID: {}. Sending now.", notificationIds.size(), userIdStr);

        for (String notificationId : notificationIds) {
            String notificationKey = NOTIFICATION_HASH_KEY_PREFIX + notificationId;
            String payload = (String) redisTemplate.opsForHash().get(notificationKey, "payload");

            if (payload != null) {
                try {
                    // The payload is already a JSON string, but we send it as an object
                    // so the client doesn't have to parse it twice.
                    Object payloadObject = objectMapper.readValue(payload, Object.class);
                    messagingTemplate.convertAndSendToUser(userIdStr, "/queue/enrollments", payloadObject);

                    // Clean up: remove the notification from Redis after successful delivery
                    redisTemplate.opsForZSet().remove(userNotificationsKey, notificationId);
                    redisTemplate.delete(notificationKey);
                    log.debug("Sent and removed pending notification {}", notificationId);
                } catch (JsonProcessingException e) {
                    log.error("Could not deserialize payload for notification {}, skipping.", notificationId, e);
                }
            } else {
                log.warn("Payload for notification ID {} was null. Removing stale reference.", notificationId);
                // Clean up stale reference if the hash is missing
                redisTemplate.opsForZSet().remove(userNotificationsKey, notificationId);
            }
        }
        log.info("Finished sending all pending notifications for user ID: {}", userIdStr);
    }
}