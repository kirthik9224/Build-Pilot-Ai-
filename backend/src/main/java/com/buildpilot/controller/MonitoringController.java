// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: MonitoringController for application health pings, telemetry, and alerts

package com.buildpilot.controller;

import com.buildpilot.model.HealthCheckRecord;
import com.buildpilot.model.MonitoredService;
import com.buildpilot.model.MonitoringAlert;
import com.buildpilot.repository.HealthCheckRecordRepository;
import com.buildpilot.repository.MonitoredServiceRepository;
import com.buildpilot.repository.MonitoringAlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoredServiceRepository serviceRepository;
    private final HealthCheckRecordRepository recordRepository;
    private final MonitoringAlertRepository alertRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public MonitoringController(MonitoredServiceRepository serviceRepository,
                                HealthCheckRecordRepository recordRepository,
                                MonitoringAlertRepository alertRepository) {
        this.serviceRepository = serviceRepository;
        this.recordRepository = recordRepository;
        this.alertRepository = alertRepository;
    }

    public record AddServiceRequest(
            Long projectId,
            String name,
            String endpointUrl,
            Integer intervalSeconds,
            Boolean simulated
    ) {}

    @GetMapping("/services")
    public List<MonitoredService> getServices(
            @RequestParam(defaultValue = "1") Long projectId) {
        List<MonitoredService> list = serviceRepository.findByProjectId(projectId);
        if (list.isEmpty()) {
            // Seed initial real and demo service targets
            MonitoredService s1 = new MonitoredService();
            s1.setProjectId(projectId);
            s1.setName("BuildPilot Backend API");
            s1.setEndpointUrl("http://localhost:8080/api/help");
            s1.setStatus(MonitoredService.Status.UP);
            s1.setLastResponseTimeMs(24L);
            s1.setUptimePercentage(99.9);
            s1.setLastCheckedAt(LocalDateTime.now());
            s1.setSimulated(false);
            serviceRepository.save(s1);

            MonitoredService s2 = new MonitoredService();
            s2.setProjectId(projectId);
            s2.setName("Frontend Vite Server");
            s2.setEndpointUrl("http://localhost:5173");
            s2.setStatus(MonitoredService.Status.UP);
            s2.setLastResponseTimeMs(15L);
            s2.setUptimePercentage(100.0);
            s2.setLastCheckedAt(LocalDateTime.now());
            s2.setSimulated(false);
            serviceRepository.save(s2);

            list = serviceRepository.findByProjectId(projectId);
        }
        return list;
    }

    @PostMapping("/services")
    public ResponseEntity<MonitoredService> addService(@RequestBody AddServiceRequest req) {
        if (req.name() == null || req.endpointUrl() == null) {
            return ResponseEntity.badRequest().build();
        }
        MonitoredService s = new MonitoredService();
        s.setProjectId(req.projectId() != null ? req.projectId() : 1L);
        s.setName(req.name());
        s.setEndpointUrl(req.endpointUrl());
        s.setIntervalSeconds(req.intervalSeconds() != null ? req.intervalSeconds() : 60);
        s.setSimulated(Boolean.TRUE.equals(req.simulated()));
        return ResponseEntity.ok(serviceRepository.save(s));
    }

    @PostMapping("/services/{id}/ping")
    @Transactional
    public ResponseEntity<HealthCheckRecord> pingService(@PathVariable Long id) {
        Optional<MonitoredService> opt = serviceRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        MonitoredService s = opt.get();
        long start = System.currentTimeMillis();
        boolean healthy = false;
        int code = 500;
        String details = "Service unreachable.";

        if (Boolean.TRUE.equals(s.getSimulated())) {
            healthy = true;
            code = 200;
            details = "Simulated synthetic heartbeat passed.";
        } else {
            try {
                var response = restTemplate.getForEntity(URI.create(s.getEndpointUrl()), String.class);
                code = response.getStatusCode().value();
                healthy = response.getStatusCode().is2xxSuccessful() ||
                          response.getStatusCode().is3xxRedirection();
                details = "HTTP Status " + code;
            } catch (Exception e) {
                healthy = false;
                details = "Connection failed: " + e.getMessage();
            }
        }

        long elapsed = System.currentTimeMillis() - start;
        s.setLastResponseTimeMs(elapsed);
        s.setLastCheckedAt(LocalDateTime.now());
        s.setStatus(healthy ? MonitoredService.Status.UP : MonitoredService.Status.DOWN);
        serviceRepository.save(s);

        HealthCheckRecord record = new HealthCheckRecord(
                s.getId(), code, elapsed, healthy, details
        );
        recordRepository.save(record);

        if (!healthy) {
            MonitoringAlert alert = new MonitoringAlert();
            alert.setProjectId(s.getProjectId());
            alert.setServiceId(s.getId());
            alert.setSeverity(MonitoringAlert.Severity.CRITICAL);
            alert.setMessage("Service '" + s.getName() + "' ping failed: " + details);
            alertRepository.save(alert);
        }

        return ResponseEntity.ok(record);
    }

    @GetMapping("/services/{id}/records")
    public List<HealthCheckRecord> getRecords(@PathVariable Long id) {
        return recordRepository.findTop20ByServiceIdOrderByRecordedAtDesc(id);
    }

    @GetMapping("/alerts")
    public List<MonitoringAlert> getAlerts(
            @RequestParam(defaultValue = "1") Long projectId) {
        return alertRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    @PatchMapping("/alerts/{id}/resolve")
    @Transactional
    public ResponseEntity<MonitoringAlert> resolveAlert(@PathVariable Long id) {
        return alertRepository.findById(id).map(a -> {
            a.setResolved(true);
            a.setResolvedAt(LocalDateTime.now());
            return ResponseEntity.ok(alertRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }
}
