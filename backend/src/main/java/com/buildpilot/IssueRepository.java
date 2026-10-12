// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Issue repository for querying defects and fixes by project and status

package com.buildpilot;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByStatus(Issue.Status status);
    List<Issue> findByProjectId(Long projectId);
    List<Issue> findByProjectIdAndStatus(Long projectId, Issue.Status status);
}
