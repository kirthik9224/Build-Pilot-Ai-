// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: CodeReview entity representing submitted code reviews

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "code_reviews")
public class CodeReview {

    public enum Status { PENDING, COMPLETED, FAILED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(length = 40)
    private String language;

    @Column(name = "file_path", length = 200)
    private String filePath;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.PENDING;

    @Column(length = 500)
    private String summary;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewFinding> findings = new ArrayList<>();

    public CodeReview() {}

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<ReviewFinding> getFindings() { return findings; }
    public void setFindings(List<ReviewFinding> findings) { this.findings = findings; }

    public void addFinding(ReviewFinding finding) {
        findings.add(finding);
        finding.setReview(this);
    }
}
