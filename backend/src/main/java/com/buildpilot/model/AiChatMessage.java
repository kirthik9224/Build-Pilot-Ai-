// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: AiChatMessage entity storing conversations between developer and AI assistant

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_messages")
public class AiChatMessage {

    public enum Role { USER, ASSISTANT, SYSTEM }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String content;

    @Column(name = "context_file", length = 200)
    private String contextFile;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AiChatMessage() {}

    public AiChatMessage(Long projectId, Long userId, Role role, String content,
                         String contextFile) {
        this.projectId = projectId;
        this.userId = userId;
        this.role = role;
        this.content = content;
        this.contextFile = contextFile;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getContextFile() { return contextFile; }
    public void setContextFile(String contextFile) { this.contextFile = contextFile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
