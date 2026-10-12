// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Issue entity representing detected code defects, bugs, and fixes

package com.buildpilot;

import jakarta.persistence.*;

@Entity
@Table(name = "issues")
public class Issue {

    public enum Severity {
        CRITICAL(15), HIGH(8), MEDIUM(4), LOW(1);
        public final int weight;
        Severity(int weight) { this.weight = weight; }
    }

    public enum Status { OPEN, RESOLVED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId = 1L;

    private String title;
    private String category;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    private String fileName;

    @Column(length = 800)
    private String rootCause;

    @Column(length = 800)
    private String impact;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    @Column(name = "line_no")
    private Integer lineNo;

    @Column(columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(columnDefinition = "TEXT")
    private String suggestedFix;

    @Column(name = "verified_fix")
    private Boolean verifiedFix = false;

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Integer getLineNo() { return lineNo; }
    public void setLineNo(Integer lineNo) { this.lineNo = lineNo; }
    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }
    public String getSuggestedFix() { return suggestedFix; }
    public void setSuggestedFix(String suggestedFix) { this.suggestedFix = suggestedFix; }
    public Boolean getVerifiedFix() { return verifiedFix; }
    public void setVerifiedFix(Boolean verifiedFix) { this.verifiedFix = verifiedFix; }
}
