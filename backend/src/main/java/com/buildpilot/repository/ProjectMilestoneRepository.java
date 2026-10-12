// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: ProjectMilestone repository for milestone deadlines and completion states

package com.buildpilot.repository;

import com.buildpilot.model.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, Long> {
    List<ProjectMilestone> findByProjectIdOrderByTargetDateAsc(Long projectId);
}
