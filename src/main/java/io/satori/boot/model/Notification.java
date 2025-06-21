package io.satori.boot.model;

import java.io.Serializable;
import java.time.Instant;

// No longer a JPA Entity. It's a simple data holder.
// Implementing Serializable is a good practice for objects stored in Redis.
public class Notification implements Serializable {

    private String id; // Using String for UUID
    private Long recipientId;
    private String payload; // The JSON payload
    private Instant createdAt;

    // Constructors
    public Notification() {}

    public Notification(String id, Long recipientId, String payload, Instant createdAt) {
        this.id = id;
        this.recipientId = recipientId;
        this.payload = payload;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}