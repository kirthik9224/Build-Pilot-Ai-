// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: MonitoringAlert repository for querying incident logs and unread alerts

package com.buildpilot.repository;

import com.buildpilot.model.MonitoringAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MonitoringAlertRepository extends JpaRepository<MonitoringAlert, Long> {
    List<MonitoringAlert> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<MonitoringAlert> findByProjectIdAndResolvedFalse(Long projectId);
}
