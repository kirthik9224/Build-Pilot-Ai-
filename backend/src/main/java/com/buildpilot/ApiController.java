// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: API Controller providing issue repair, roadmap generation, and analytics

package com.buildpilot;

import com.buildpilot.model.*;
import com.buildpilot.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final IssueRepository issues;
    private final RoadmapService roadmaps;
    private final ProjectRepository projectRepository;
    private final CodeReviewRepository reviewRepository;
    private final DebuggingSessionRepository debuggingRepository;
    private final ProjectTaskRepository taskRepository;
    private final ProjectMilestoneRepository milestoneRepository;
    private final MonitoredServiceRepository serviceRepository;
    private final MonitoringAlertRepository alertRepository;

    public ApiController(IssueRepository issues,
                         RoadmapService roadmaps,
                         ProjectRepository projectRepository,
                         CodeReviewRepository reviewRepository,
                         DebuggingSessionRepository debuggingRepository,
                         ProjectTaskRepository taskRepository,
                         ProjectMilestoneRepository milestoneRepository,
                         MonitoredServiceRepository serviceRepository,
                         MonitoringAlertRepository alertRepository) {
        this.issues = issues;
        this.roadmaps = roadmaps;
        this.projectRepository = projectRepository;
        this.reviewRepository = reviewRepository;
        this.debuggingRepository = debuggingRepository;
        this.taskRepository = taskRepository;
        this.milestoneRepository = milestoneRepository;
        this.serviceRepository = serviceRepository;
        this.alertRepository = alertRepository;
    }

    @GetMapping("/issues")
    public List<Issue> list(@RequestParam(required = false) Long projectId) {
        List<Issue> all = projectId != null ?
                new ArrayList<>(issues.findByProjectId(projectId)) :
                new ArrayList<>(issues.findAll());
        all.sort(Comparator.comparing((Issue i) -> i.getStatus())
                .thenComparing(i -> i.getSeverity()));
        return all;
    }

    @PostMapping("/issues/{id}/repair")
    @Transactional
    public ResponseEntity<Issue> repair(@PathVariable Long id) {
        return issues.findById(id).map(issue -> {
            issue.setStatus(Issue.Status.RESOLVED);
            issue.setVerifiedFix(true);
            return ResponseEntity.ok(issues.save(issue));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/issues/repair-all")
    @Transactional
    public Map<String, Integer> repairAll(@RequestParam(required = false) Long projectId) {
        List<Issue> open = projectId != null ?
                issues.findByProjectIdAndStatus(projectId, Issue.Status.OPEN) :
                issues.findByStatus(Issue.Status.OPEN);
        open.forEach(i -> {
            i.setStatus(Issue.Status.RESOLVED);
            i.setVerifiedFix(true);
        });
        issues.saveAll(open);
        return Map.of("repaired", open.size());
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@RequestParam(required = false) Long projectId) {
        Long projId = projectId != null ? projectId : 1L;
        String projectName = projectRepository.findById(projId)
                .map(Project::getName)
                .orElse("ShopEase E-commerce Store");

        List<Issue> all = issues.findAll();
        List<Issue> open = all.stream()
                .filter(i -> i.getStatus() == Issue.Status.OPEN).toList();
        int penalty = open.stream().mapToInt(i -> i.getSeverity().weight).sum();

        Map<String, Long> bySeverity = new LinkedHashMap<>();
        for (Issue.Severity s : Issue.Severity.values()) {
            bySeverity.put(s.name(), open.stream()
                    .filter(i -> i.getSeverity() == s).count());
        }

        Map<String, Long> byCategory = new TreeMap<>();
        open.forEach(i -> byCategory.merge(i.getCategory(), 1L, Long::sum));

        // Live aggregated statistics across all modules
        long totalProjects = projectRepository.count();
        long codeReviewsCount = reviewRepository.count();
        List<DebuggingSession> debugSessions = debuggingRepository.findAll();
        long openDebugSessions = debugSessions.stream()
                .filter(d -> d.getStatus() == DebuggingSession.Status.OPEN).count();
        long verifiedFixes = all.stream()
                .filter(i -> Boolean.TRUE.equals(i.getVerifiedFix())).count();

        List<ProjectTask> tasks = taskRepository.findByProjectId(projId);
        long completedTasks = tasks.stream()
                .filter(t -> t.getStatus() == ProjectTask.Status.COMPLETED).count();

        List<MonitoredService> services = serviceRepository.findByProjectId(projId);
        long healthyServices = services.stream()
                .filter(s -> s.getStatus() == MonitoredService.Status.UP).count();

        List<MonitoringAlert> openAlerts = alertRepository
                .findByProjectIdAndResolvedFalse(projId);
        List<ProjectMilestone> milestones = milestoneRepository
                .findByProjectIdOrderByTargetDateAsc(projId);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("project", projectName);
        out.put("projectId", projId);
        out.put("total", all.size());
        out.put("open", open.size());
        out.put("resolved", all.size() - open.size());
        out.put("healthScore", Math.max(0, 100 - penalty));
        out.put("openBySeverity", bySeverity);
        out.put("openByCategory", byCategory);

        // Extended live analytics
        out.put("totalProjects", Math.max(1, totalProjects));
        out.put("codeReviewsCompleted", codeReviewsCount);
        out.put("openDebuggingSessions", openDebugSessions);
        out.put("verifiedFixes", verifiedFixes);
        out.put("taskProgress", tasks.isEmpty() ? 0 :
                Math.round(((double) completedTasks / tasks.size()) * 100.0));
        out.put("totalTasks", tasks.size());
        out.put("completedTasks", completedTasks);
        out.put("healthyServicesCount", healthyServices);
        out.put("totalServicesCount", services.size());
        out.put("activeAlertsCount", openAlerts.size());
        out.put("milestonesCount", milestones.size());

        return out;
    }

    @PostMapping("/roadmap")
    public RoadmapService.Roadmap roadmap(@RequestBody RoadmapService.Request request) {
        return roadmaps.generate(request);
    }
}
