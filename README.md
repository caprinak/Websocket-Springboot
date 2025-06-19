# Spring Boot WebSocket Real-time Applications Demo

This project demonstrates real-time communication using WebSockets (with STOMP over SockJS) in a Spring Boot application. It includes examples for:
1.  A simulated stock trading application with live price updates (Thymeleaf client).
2.  A user-specific notification system (Angular client and REST-triggered).

## Overview

The application showcases how to set up a Spring Boot backend to handle WebSocket connections, broadcast messages to topics, send user-specific messages, and integrate with different types of frontend clients.

## Features

*   **Real-time Stock Price Updates:**
    *   Backend simulates stock price changes.
    *   Prices are broadcast over a public WebSocket topic (`/topic/price`).
    *   A Thymeleaf frontend subscribes to this topic and displays live updates.
*   **User-Specific Notifications:**
    *   Backend can send notifications to specific authenticated users (e.g., enrollment alerts).
    *   Messages are sent to user-specific queues (e.g., `/user/{username}/queue/enrollments`).
    *   An Angular frontend demonstrates subscribing to these user-specific notifications.
    *   REST endpoints are provided to trigger these test notifications.
*   **STOMP Messaging Protocol:** Uses STOMP over WebSockets for structured messaging.
*   **SockJS Fallback:** Ensures wider browser compatibility if direct WebSocket connections are not available.
*   **Spring Security:** Basic configuration to secure endpoints and manage WebSocket connections, including CORS and CSRF handling.
*   **Dual Clients:**
    *   **Thymeleaf Client:** For the stock trading demo.
    *   **Angular Client:** For the user notification demo.

## Technologies Used

*   **Backend:**
    *   Java 17+
    *   Spring Boot 3.x
    *   Spring WebSocket (STOMP, SockJS)
    *   Spring Messaging
    *   Spring Security
    *   Maven (or Gradle)
*   **Frontend (Stock Demo):**
    *   Thymeleaf
    *   HTML, CSS, JavaScript
    *   SockJS Client, STOMP.js
*   **Frontend (Notification Demo):**
    *   Angular 12+
    *   TypeScript
    *   SockJS Client, @stomp/stompjs
    *   HTML, CSS (Angular Material or basic styling)

## Prerequisites

*   JDK 17 or higher
*   Maven 3.6+ (or Gradle equivalent)
*   Node.js and npm (for the Angular client)
*   An IDE (e.g., IntelliJ IDEA, VS Code, Eclipse)

## Setup and Running

### 1. Backend (Spring Boot Application)

1.  **Clone the repository:**
### GET request to example server. Call requests to Test notification system
POST http://localhost:8080/api/test-notifications/user/teacher123
Content-Type: application/json

{
"type": "NEW_ENROLLMENT_ALERT",
"studentName": "Jane Doe (Dummy)",
"courseName": "Introduction to WebSockets",
"message": "A new student has been enrolled in your course. Please check the dashboard."
// "timestamp": 1750321052834 // Trailing comma removed, timestamp commented out as it was missing in the original
}

### Request to a different user endpoint (potentially a typo or different controller)
POST http://localhost:8080/user/prof456 # Note: This endpoint /user/{username} is different from /api/test-notifications/user/{username}
Content-Type: application/json

{
"type": "NEW_ENROLLMENT_ALERT",
"studentName": "Jimmy Doe (Dummy)",
"courseName": "  Pro", # Consider trimming whitespace for "courseName" if it's not intentional
"message": "A new student has been enrolled in your course. Please check the dashboard.",
"timestamp": 1750321052837
}
