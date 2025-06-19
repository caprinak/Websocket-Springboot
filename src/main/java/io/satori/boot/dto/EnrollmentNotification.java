// You can place this in a 'dto' or 'model' package
package io.satori.boot.dto;

public class EnrollmentNotification {
    private String type;
    private String studentName;
    private String courseName;
    private String message;

    // Constructors, Getters, and Setters
    public EnrollmentNotification(String type, String studentName, String courseName, String message) {
        this.type = type;
        this.studentName = studentName;
        this.courseName = courseName;
        this.message = message;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}