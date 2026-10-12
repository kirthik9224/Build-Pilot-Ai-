// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: MonitoredService repository for querying active monitored endpoints

package com.buildpilot.repository;

import com.buildpilot.model.MonitoredService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MonitoredServiceRepository extends JpaRepository<MonitoredService, Long> {
    List<MonitoredService> findByProjectId(Long projectId);
    List<MonitoredService> findByActiveTrue();
}
