// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: ProjectTask repository for planning and task progress tracking

package com.buildpilot.repository;

import com.buildpilot.model.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
    List<ProjectTask> findByProjectId(Long projectId);
    List<ProjectTask> findByProjectIdAndStatus(Long projectId, ProjectTask.Status status);
}
