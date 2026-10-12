// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: DebuggingSession entity managing error traces and diagnosis workflows

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "debugging_sessions")
public class DebuggingSession {

    public enum Status { OPEN, IN_PROGRESS, RESOLVED, VERIFIED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(name = "error_type", length = 80)
    private String errorType; // Java Exception, Spring Boot Stacktrace, React Console Error, Build Log

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String stackTrace;

    @Column(columnDefinition = "TEXT")
    private String contextCode;

    @Column(columnDefinition = "TEXT")
    private String rootCause;

    @Column(columnDefinition = "TEXT")
    private String stepsToFix;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.OPEN;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposedFix> fixes = new ArrayList<>();

    public DebuggingSession() {}

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }
    public String getStackTrace() { return stackTrace; }
    public void setStackTrace(String stackTrace) { this.stackTrace = stackTrace; }
    public String getContextCode() { return contextCode; }
    public void setContextCode(String contextCode) { this.contextCode = contextCode; }
    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }
    public String getStepsToFix() { return stepsToFix; }
    public void setStepsToFix(String stepsToFix) { this.stepsToFix = stepsToFix; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<ProposedFix> getFixes() { return fixes; }
    public void setFixes(List<ProposedFix> fixes) { this.fixes = fixes; }

    public void addFix(ProposedFix fix) {
        fixes.add(fix);
        fix.setSession(this);
    }
}
