package io.satori.boot.controller;

import io.satori.boot.dto.EnrollmentNotification; // If you created the DTO
import io.satori.boot.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test-notifications")
public class TestNotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/user/{username}")
    public ResponseEntity<String> sendTestUserNotification(@PathVariable String username) {
        // Option 1: Using a Map for the payload
        Map<String, Object> dummyPayload = new HashMap<>();
        dummyPayload.put("type", "NEW_ENROLLMENT_ALERT");
        dummyPayload.put("studentName", "Jane Doe (Dummy)");
        dummyPayload.put("courseName", "Introduction to WebSockets");
        dummyPayload.put("message", "A new student has been enrolled in your course. Please check the dashboard.");
        dummyPayload.put("timestamp", System.currentTimeMillis());

        notificationService.sendEnrollmentNotificationToTeacher(username, dummyPayload);
        return ResponseEntity.ok("Test user notification sent to " + username);
    }

    @PostMapping("/user-dto/{username}")
    public ResponseEntity<String> sendTestUserDtoNotification(@PathVariable String username) {
        // Option 2: Using the DTO (if you created EnrollmentNotification.java)
        EnrollmentNotification dummyDtoPayload = new EnrollmentNotification(
                "NEW_ENROLLMENT_DTO",
                "John Smith (Dummy DTO)",
                "Advanced Spring Boot",
                "DTO: New student enrollment processed."
        );

        notificationService.sendEnrollmentNotificationToTeacher(username, dummyDtoPayload);
        return ResponseEntity.ok("Test user DTO notification sent to " + username);
    }
}