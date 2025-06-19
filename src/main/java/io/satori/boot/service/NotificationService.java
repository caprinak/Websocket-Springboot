package io.satori.boot.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

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
    public void sendEnrollmentNotificationToTeacher(String teacherUsername, Object payload) {
        // Spring routes this to the specific user's queue
        messagingTemplate.convertAndSendToUser(teacherUsername, "/queue/enrollments", payload);
    }

   /* Topic-Based Subscriptions (for groups):•You can define topics based on teacher groups, classes, or other criteria.
   For example, /topic/class/math101/enrollments or /topic/teachers/groupA/notifications.•Teachers belonging to "groupA"
   would subscribe to /topic/teachers/groupA/notifications.Topic-Based Subscriptions (for groups):•You can define topics based on teacher groups, classes, or other criteria. For example, /topic/class/math101/enrollments or /topic/teachers/groupA/notifications.•Teachers belonging to "groupA" would subscribe to /topic/teachers/groupA/notifications.*/
    public void sendEnrollmentNotificationToTeacherGroup(String groupId, Object payload) {
        String destination = "/topic/teachers/" + groupId + "/enrollments";
        messagingTemplate.convertAndSend(destination, payload);
    }


}
