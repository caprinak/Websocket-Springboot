package io.satori.boot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.satori.boot.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class NotificationService {
    // Define key prefixes for better organization in Redis
    private static final String NOTIFICATION_HASH_KEY_PREFIX = "notification:";
    private static final String USER_NOTIFICATIONS_ZSET_KEY_PREFIX = "user:notifications:";


    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public NotificationService(SimpMessagingTemplate messagingTemplate, RedisTemplate<String, String> redisTemplate,
                               ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }
    /*
    Frontend (Teacher's Client): The teacher's client would subscribe to /user/queue/enrollments after connecting and
     authenticating.
        Frontend (Teacher's Client): The teacher's client would subscribe to /user/queue/enrollments after connecting
        and authenticating.
    */
    public void sendEnrollmentNotificationToTeacher(Long teacherId, Object payload) {
        try {
            String payloadAsString = objectMapper.writeValueAsString(payload);
            String notificationId = UUID.randomUUID().toString();
            Instant creationTime = Instant.now();
            // 1. Create the notification object
            Notification notification = new Notification(notificationId, teacherId, payloadAsString, creationTime);

            // 2. Persist to Redis
            // The key for the user's sorted set of notifications
            String userNotificationsKey = USER_NOTIFICATIONS_ZSET_KEY_PREFIX + teacherId;
            // The key for the notification data hash
            String notificationKey = NOTIFICATION_HASH_KEY_PREFIX + notificationId;

            // Use a transaction (MULTI/EXEC) to ensure both operations succeed or fail together
            redisTemplate.opsForHash().put(notificationKey, "payload", payloadAsString);
            redisTemplate.opsForZSet().add(userNotificationsKey, notificationId, creationTime.toEpochMilli());

            log.info("Persisted notification {} for teacher ID: {} to Redis.", notificationId, teacherId);
// 3. Attempt real-time delivery
            log.info("Attempting to send real-time notification to teacher ID: {}", teacherId);
            messagingTemplate.convertAndSendToUser(teacherId.toString(), "/queue/enrollments", payload);

        } catch (JsonProcessingException e) {
            log.error("Could not serialize payload for teacher ID: {}. Notification not sent.", teacherId, e);
        }

        // Spring routes this to the specific user's queue
        log.info("Sending enrollment notification to teacher with ID: {}", teacherId);
        messagingTemplate.convertAndSendToUser(teacherId.toString(), "/queue/enrollments", payload);
    }

   /* Topic-Based Subscriptions (for groups):•You can define topics based on teacher groups, classes, or other criteria.
   For example, /topic/class/math101/enrollments or /topic/teachers/groupA/notifications.•Teachers belonging to "groupA"
   would subscribe to /topic/teachers/groupA/notifications.Topic-Based Subscriptions (for groups):•You can define topics based on teacher groups, classes, or other criteria. For example, /topic/class/math101/enrollments or /topic/teachers/groupA/notifications.•Teachers belonging to "groupA" would subscribe to /topic/teachers/groupA/notifications.*/
    public void sendEnrollmentNotificationToTeacherGroup(String groupId, Object payload) {
        log.info("Sending enrollment notification to teacher group with ID: {}", groupId);
        String destination = "/topic/teachers/" + groupId + "/enrollments";
        messagingTemplate.convertAndSend(destination, payload);
    }


}
