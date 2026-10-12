// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: ReviewFinding entity representing specific code review issues and suggested fixes

package com.buildpilot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "review_findings")
public class ReviewFinding {

    public enum Status { PENDING, ACCEPTED, REJECTED }
    public enum Source { STATIC_ANALYSIS, AI_HYPOTHESIS, TEST_CONFIRMED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @JsonIgnore
    private CodeReview review;

    @Column(nullable = false, length = 20)
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false, length = 40)
    private String category; // Security, Performance, Bug, Code Smells, Architecture

    @Column(name = "file_path", length = 200)
    private String filePath;

    @Column(name = "line_start")
    private Integer lineStart;

    @Column(name = "line_end")
    private Integer lineEnd;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String explanation;

    @Column(columnDefinition = "TEXT")
    private String suggestedCorrection;

    @Column(columnDefinition = "TEXT")
    private String proposedDiff;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Source source = Source.STATIC_ANALYSIS;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    public ReviewFinding() {}

    public Long getId() { return id; }
    public CodeReview getReview() { return review; }
    public void setReview(CodeReview review) { this.review = review; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Integer getLineStart() { return lineStart; }
    public void setLineStart(Integer lineStart) { this.lineStart = lineStart; }
    public Integer getLineEnd() { return lineEnd; }
    public void setLineEnd(Integer lineEnd) { this.lineEnd = lineEnd; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getSuggestedCorrection() { return suggestedCorrection; }
    public void setSuggestedCorrection(String suggestedCorrection) {
        this.suggestedCorrection = suggestedCorrection;
    }
    public String getProposedDiff() { return proposedDiff; }
    public void setProposedDiff(String proposedDiff) { this.proposedDiff = proposedDiff; }
    public Source getSource() { return source; }
    public void setSource(Source source) { this.source = source; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
