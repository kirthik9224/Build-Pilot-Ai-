// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: CodeReview repository for fetching code review sessions by project

package com.buildpilot.repository;

import com.buildpilot.model.CodeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodeReviewRepository extends JpaRepository<CodeReview, Long> {
    List<CodeReview> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
