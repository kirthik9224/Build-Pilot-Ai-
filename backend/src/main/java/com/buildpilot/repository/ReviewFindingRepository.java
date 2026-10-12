// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: ReviewFinding repository for retrieving code findings by review and status

package com.buildpilot.repository;

import com.buildpilot.model.ReviewFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewFindingRepository extends JpaRepository<ReviewFinding, Long> {
    List<ReviewFinding> findByReviewId(Long reviewId);
}
