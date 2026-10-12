// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: ProposedFix entity storing suggested code modifications and verification tests

package com.buildpilot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposed_fixes")
public class ProposedFix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private DebuggingSession session;

    @Column(nullable = false, length = 200)
    private String description;

    @Column(name = "target_file", length = 200)
    private String targetFile;

    @Column(columnDefinition = "TEXT")
    private String originalSnippet;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String fixedSnippet;

    @Column(columnDefinition = "TEXT")
    private String diffPatch;

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(name = "verification_passed")
    private Boolean verificationPassed = false;

    @Column(columnDefinition = "TEXT")
    private String testOutput;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProposedFix() {}

    public Long getId() { return id; }
    public DebuggingSession getSession() { return session; }
    public void setSession(DebuggingSession session) { this.session = session; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTargetFile() { return targetFile; }
    public void setTargetFile(String targetFile) { this.targetFile = targetFile; }
    public String getOriginalSnippet() { return originalSnippet; }
    public void setOriginalSnippet(String originalSnippet) {
        this.originalSnippet = originalSnippet;
    }
    public String getFixedSnippet() { return fixedSnippet; }
    public void setFixedSnippet(String fixedSnippet) { this.fixedSnippet = fixedSnippet; }
    public String getDiffPatch() { return diffPatch; }
    public void setDiffPatch(String diffPatch) { this.diffPatch = diffPatch; }
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public Boolean getVerificationPassed() { return verificationPassed; }
    public void setVerificationPassed(Boolean verificationPassed) {
        this.verificationPassed = verificationPassed;
    }
    public String getTestOutput() { return testOutput; }
    public void setTestOutput(String testOutput) { this.testOutput = testOutput; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
