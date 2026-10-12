// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: DesignGeneration entity for natural-language to responsive React component specs

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "design_generations")
public class DesignGeneration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 100)
    private String componentName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(length = 40)
    private String layoutPreset; // dashboard, card, checkout, navbar, table

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String generatedJsx;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String generatedCss;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public DesignGeneration() {}

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getComponentName() { return componentName; }
    public void setComponentName(String componentName) { this.componentName = componentName; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getLayoutPreset() { return layoutPreset; }
    public void setLayoutPreset(String layoutPreset) { this.layoutPreset = layoutPreset; }
    public String getGeneratedJsx() { return generatedJsx; }
    public void setGeneratedJsx(String generatedJsx) { this.generatedJsx = generatedJsx; }
    public String getGeneratedCss() { return generatedCss; }
    public void setGeneratedCss(String generatedCss) { this.generatedCss = generatedCss; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
