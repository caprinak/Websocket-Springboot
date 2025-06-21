package io.satori.boot.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    /*
    Frontend (Teacher's Client): The teacher's client would subscribe to /user/queue/enrollments after connecting and
     authenticating.
        Frontend (Teacher's Client): The teacher's client would subscribe to /user/queue/enrollments after connecting
        and authenticating.
    */
    public void sendEnrollmentNotificationToTeacher(Long teacherId, Object payload) {
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
