// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: ProposedFix repository for retrieving code fixes by debugging session

package com.buildpilot.repository;

import com.buildpilot.model.ProposedFix;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProposedFixRepository extends JpaRepository<ProposedFix, Long> {
    List<ProposedFix> findBySessionId(Long sessionId);
}
