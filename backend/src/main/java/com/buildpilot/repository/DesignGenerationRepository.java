// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: DesignGeneration repository for saving and retrieving generated UI components

package com.buildpilot.repository;

import com.buildpilot.model.DesignGeneration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DesignGenerationRepository extends JpaRepository<DesignGeneration, Long> {
    List<DesignGeneration> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
