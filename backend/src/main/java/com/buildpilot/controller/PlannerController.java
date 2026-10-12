// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: PlannerController for project tasks, milestones, and delivery risk forecast

package com.buildpilot.controller;

import com.buildpilot.model.ProjectMilestone;
import com.buildpilot.model.ProjectTask;
import com.buildpilot.repository.ProjectMilestoneRepository;
import com.buildpilot.repository.ProjectTaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/planner")
public class PlannerController {

    private final ProjectTaskRepository taskRepository;
    private final ProjectMilestoneRepository milestoneRepository;

    public PlannerController(ProjectTaskRepository taskRepository,
                             ProjectMilestoneRepository milestoneRepository) {
        this.taskRepository = taskRepository;
        this.milestoneRepository = milestoneRepository;
    }

    public record CreateTaskRequest(
            Long projectId,
            String title,
            String description,
            String priority,
            Double estimatedHours,
            String assigneeName,
            Long dependsOnTaskId
    ) {}

    public record UpdateTaskRequest(
            String status,
            String priority,
            Double estimatedHours,
            String assigneeName
    ) {}

    public record CreateMilestoneRequest(
            Long projectId,
            String title,
            String description
    ) {}

    @GetMapping("/tasks")
    public List<ProjectTask> getTasks(
            @RequestParam(defaultValue = "1") Long projectId) {
        List<ProjectTask> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) {
            // Seed sample tasks for demo project
            ProjectTask t1 = new ProjectTask();
            t1.setProjectId(projectId);
            t1.setTitle("Migrate Auth to Spring Security BCrypt & JWT");
            t1.setDescription("Upgrade session tokens to JWT and passwords to BCrypt");
            t1.setPriority(ProjectTask.Priority.HIGH);
            t1.setStatus(ProjectTask.Status.COMPLETED);
            t1.setEstimatedHours(6.0);
            t1.setAssigneeName("Kirthik");
            taskRepository.save(t1);

            ProjectTask t2 = new ProjectTask();
            t2.setProjectId(projectId);
            t2.setTitle("Implement Code Review & Static Analysis Engine");
            t2.setDescription("Detect SQL injection, contrast, accessibility, and hardcoded secrets");
            t2.setPriority(ProjectTask.Priority.CRITICAL);
            t2.setStatus(ProjectTask.Status.IN_PROGRESS);
            t2.setEstimatedHours(10.0);
            t2.setAssigneeName("Kirthik");
            taskRepository.save(t2);

            ProjectTask t3 = new ProjectTask();
            t3.setProjectId(projectId);
            t3.setTitle("Deploy Uptime Telemetry & Live Incident Monitoring");
            t3.setDescription("Real HTTP health pinging with latency tracking and alert rules");
            t3.setPriority(ProjectTask.Priority.HIGH);
            t3.setStatus(ProjectTask.Status.TODO);
            t3.setEstimatedHours(8.0);
            t3.setAssigneeName("Kirthik");
            taskRepository.save(t3);

            tasks = taskRepository.findByProjectId(projectId);
        }
        return tasks;
    }

    @PostMapping("/tasks")
    public ResponseEntity<ProjectTask> createTask(@RequestBody CreateTaskRequest req) {
        if (req.title() == null || req.title().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ProjectTask task = new ProjectTask();
        task.setProjectId(req.projectId() != null ? req.projectId() : 1L);
        task.setTitle(req.title().trim());
        task.setDescription(req.description());
        if (req.priority() != null) {
            try { task.setPriority(ProjectTask.Priority.valueOf(req.priority().toUpperCase())); }
            catch (Exception ignored) {}
        }
        if (req.estimatedHours() != null) task.setEstimatedHours(req.estimatedHours());
        task.setAssigneeName(req.assigneeName() != null ? req.assigneeName() : "Unassigned");
        task.setDependsOnTaskId(req.dependsOnTaskId());
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PatchMapping("/tasks/{id}")
    @Transactional
    public ResponseEntity<ProjectTask> updateTask(@PathVariable Long id,
                                                  @RequestBody UpdateTaskRequest req) {
        return taskRepository.findById(id).map(task -> {
            if (req.status() != null) {
                try { task.setStatus(ProjectTask.Status.valueOf(req.status().toUpperCase())); }
                catch (Exception ignored) {}
            }
            if (req.priority() != null) {
                try { task.setPriority(ProjectTask.Priority.valueOf(req.priority().toUpperCase())); }
                catch (Exception ignored) {}
            }
            if (req.estimatedHours() != null) task.setEstimatedHours(req.estimatedHours());
            if (req.assigneeName() != null) task.setAssigneeName(req.assigneeName());
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/milestones")
    public List<ProjectMilestone> getMilestones(
            @RequestParam(defaultValue = "1") Long projectId) {
        List<ProjectMilestone> list =
                milestoneRepository.findByProjectIdOrderByTargetDateAsc(projectId);
        if (list.isEmpty()) {
            ProjectMilestone m1 = new ProjectMilestone();
            m1.setProjectId(projectId);
            m1.setTitle("Beta Release — Core AI Dev Assistant");
            m1.setDescription("Code review, debugger verification, and workspace planning");
            m1.setCompleted(false);
            milestoneRepository.save(m1);
            list = milestoneRepository.findByProjectIdOrderByTargetDateAsc(projectId);
        }
        return list;
    }

    @PostMapping("/milestones")
    public ResponseEntity<ProjectMilestone> createMilestone(
            @RequestBody CreateMilestoneRequest req) {
        if (req.title() == null || req.title().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ProjectMilestone m = new ProjectMilestone();
        m.setProjectId(req.projectId() != null ? req.projectId() : 1L);
        m.setTitle(req.title().trim());
        m.setDescription(req.description());
        return ResponseEntity.ok(milestoneRepository.save(m));
    }

    @PatchMapping("/milestones/{id}/toggle")
    @Transactional
    public ResponseEntity<ProjectMilestone> toggleMilestone(@PathVariable Long id) {
        return milestoneRepository.findById(id).map(m -> {
            m.setCompleted(!m.getCompleted());
            return ResponseEntity.ok(milestoneRepository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/forecast")
    public Map<String, Object> forecast(
            @RequestParam(defaultValue = "1") Long projectId,
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "3") int teamSize) {
        List<ProjectTask> tasks = taskRepository.findByProjectId(projectId);
        double totalHours = tasks.stream().mapToDouble(ProjectTask::getEstimatedHours).sum();
        long completedCount = tasks.stream()
                .filter(t -> t.getStatus() == ProjectTask.Status.COMPLETED).count();
        long blockedCount = tasks.stream()
                .filter(t -> t.getStatus() == ProjectTask.Status.BLOCKED).count();

        double capacityHours = days * teamSize * 6.0; // 6 productive hours/day
        double remainingHours = tasks.stream()
                .filter(t -> t.getStatus() != ProjectTask.Status.COMPLETED)
                .mapToDouble(ProjectTask::getEstimatedHours).sum();

        double loadRatio = capacityHours > 0 ?
                Math.round((remainingHours / capacityHours) * 100.0) / 100.0 : 1.0;
        String risk = loadRatio > 1.0 ? "HIGH" : loadRatio > 0.7 ? "MEDIUM" : "LOW";

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("disclaimer", "Note: Estimates are algorithmic projections, not guaranteed dates.");
        res.put("totalTasks", tasks.size());
        res.put("completedTasks", completedCount);
        res.put("blockedTasks", blockedCount);
        res.put("remainingHours", remainingHours);
        res.put("capacityHours", capacityHours);
        res.put("loadRatio", loadRatio);
        res.put("risk", risk);
        res.put("progressPercent", tasks.isEmpty() ? 0 :
                Math.round(((double) completedCount / tasks.size()) * 100.0));
        return res;
    }
}
