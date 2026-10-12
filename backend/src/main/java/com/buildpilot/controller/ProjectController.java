// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Project controller for workspace management and project access control

package com.buildpilot.controller;

import com.buildpilot.model.Project;
import com.buildpilot.model.User;
import com.buildpilot.repository.ProjectRepository;
import com.buildpilot.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectRepository projectRepository,
                             UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public record CreateProjectRequest(String name, String description) {}

    @GetMapping
    public List<Project> list(Authentication auth) {
        if (auth == null) return List.of();
        Optional<User> user = userRepository.findByEmail(auth.getName());
        if (user.isEmpty()) return List.of();

        List<Project> projects = projectRepository.findByOwnerId(user.get().getId());
        if (projects.isEmpty()) {
            Project defaultP = new Project(
                    user.get().getName() + "'s Workspace",
                    "Primary workspace",
                    user.get().getId()
            );
            projects = List.of(projectRepository.save(defaultP));
        }
        return projects;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateProjectRequest req,
                                    Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        if (req.name() == null || req.name().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Project name is required."));
        }

        Optional<User> user = userRepository.findByEmail(auth.getName());
        if (user.isEmpty()) return ResponseEntity.status(401).build();

        Project project = new Project(
                req.name().trim(),
                req.description() != null ? req.description().trim() : "",
                user.get().getId()
        );
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> get(@PathVariable Long id, Authentication auth) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
