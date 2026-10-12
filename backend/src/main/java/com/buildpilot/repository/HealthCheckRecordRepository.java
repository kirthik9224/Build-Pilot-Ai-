// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: HealthCheckRecord repository for retrieving recent health check metrics

package com.buildpilot.repository;

import com.buildpilot.model.HealthCheckRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthCheckRecordRepository extends JpaRepository<HealthCheckRecord, Long> {
    List<HealthCheckRecord> findTop20ByServiceIdOrderByRecordedAtDesc(Long serviceId);
    List<HealthCheckRecord> findByServiceId(Long serviceId);
}
