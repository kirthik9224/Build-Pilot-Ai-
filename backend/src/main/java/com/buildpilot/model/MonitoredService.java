// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: MonitoredService entity storing application targets for uptime and health checks

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "monitored_services")
public class MonitoredService {

    public enum Status { UP, DEGRADED, DOWN, UNCHECKED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "endpoint_url", nullable = false, length = 300)
    private String endpointUrl;

    @Column(name = "interval_seconds")
    private Integer intervalSeconds = 60;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.UNCHECKED;

    @Column(name = "last_response_time_ms")
    private Long lastResponseTimeMs;

    @Column(name = "uptime_percentage")
    private Double uptimePercentage = 100.0;

    @Column(name = "last_checked_at")
    private LocalDateTime lastCheckedAt;

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "is_simulated")
    private Boolean simulated = false;

    public MonitoredService() {}

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEndpointUrl() { return endpointUrl; }
    public void setEndpointUrl(String endpointUrl) { this.endpointUrl = endpointUrl; }
    public Integer getIntervalSeconds() { return intervalSeconds; }
    public void setIntervalSeconds(Integer intervalSeconds) {
        this.intervalSeconds = intervalSeconds;
    }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Long getLastResponseTimeMs() { return lastResponseTimeMs; }
    public void setLastResponseTimeMs(Long lastResponseTimeMs) {
        this.lastResponseTimeMs = lastResponseTimeMs;
    }
    public Double getUptimePercentage() { return uptimePercentage; }
    public void setUptimePercentage(Double uptimePercentage) {
        this.uptimePercentage = uptimePercentage;
    }
    public LocalDateTime getLastCheckedAt() { return lastCheckedAt; }
    public void setLastCheckedAt(LocalDateTime lastCheckedAt) {
        this.lastCheckedAt = lastCheckedAt;
    }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Boolean getSimulated() { return simulated; }
    public void setSimulated(Boolean simulated) { this.simulated = simulated; }
}
