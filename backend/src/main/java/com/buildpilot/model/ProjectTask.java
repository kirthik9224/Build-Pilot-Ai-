// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: ProjectTask entity representing development tasks, estimates, and dependencies

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_tasks")
public class ProjectTask {

    public enum Status { TODO, IN_PROGRESS, BLOCKED, COMPLETED }
    public enum Priority { LOW, MEDIUM, HIGH, CRITICAL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "estimated_hours")
    private Double estimatedHours = 8.0;

    @Column(name = "assignee_name", length = 80)
    private String assigneeName;

    @Column(name = "depends_on_task_id")
    private Long dependsOnTaskId;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProjectTask() {}

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    public String getAssigneeName() { return assigneeName; }
    public void setAssigneeName(String assigneeName) { this.assigneeName = assigneeName; }
    public Long getDependsOnTaskId() { return dependsOnTaskId; }
    public void setDependsOnTaskId(Long dependsOnTaskId) {
        this.dependsOnTaskId = dependsOnTaskId;
    }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
