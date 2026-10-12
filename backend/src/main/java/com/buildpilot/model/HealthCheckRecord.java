// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: HealthCheckRecord entity tracking response metrics, status codes, and error logs

package com.buildpilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_check_records")
public class HealthCheckRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "response_time_ms", nullable = false)
    private Long responseTimeMs;

    @Column(nullable = false)
    private Boolean healthy;

    @Column(length = 500)
    private String details;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public HealthCheckRecord() {}

    public HealthCheckRecord(Long serviceId, Integer statusCode, Long responseTimeMs,
                             Boolean healthy, String details) {
        this.serviceId = serviceId;
        this.statusCode = statusCode;
        this.responseTimeMs = responseTimeMs;
        this.healthy = healthy;
        this.details = details;
    }

    public Long getId() { return id; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    public Long getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(Long responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }
    public Boolean getHealthy() { return healthy; }
    public void setHealthy(Boolean healthy) { this.healthy = healthy; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
