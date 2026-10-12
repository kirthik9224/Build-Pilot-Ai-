// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: DebuggingSession repository for managing error-to-fix tracking

package com.buildpilot.repository;

import com.buildpilot.model.DebuggingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DebuggingSessionRepository extends JpaRepository<DebuggingSession, Long> {
    List<DebuggingSession> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<DebuggingSession> findByProjectIdAndStatus(Long projectId, DebuggingSession.Status status);
}
