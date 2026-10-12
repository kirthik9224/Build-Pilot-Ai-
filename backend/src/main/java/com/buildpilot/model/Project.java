// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Project entity for managing developer workspaces and projects

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Project() {}

    public Project(String name, String description, Long ownerId) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
