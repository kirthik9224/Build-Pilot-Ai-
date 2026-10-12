// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Unit tests for PlannerController workload forecasting and task status

package com.buildpilot;

import com.buildpilot.controller.PlannerController;
import com.buildpilot.model.ProjectTask;
import com.buildpilot.repository.ProjectMilestoneRepository;
import com.buildpilot.repository.ProjectTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class PlannerControllerTest {

    private ProjectTaskRepository taskRepository;
    private ProjectMilestoneRepository milestoneRepository;
    private PlannerController plannerController;

    @BeforeEach
    void setUp() {
        taskRepository = Mockito.mock(ProjectTaskRepository.class);
        milestoneRepository = Mockito.mock(ProjectMilestoneRepository.class);
        plannerController = new PlannerController(taskRepository, milestoneRepository);
    }

    @Test
    void testForecastCalculation() {
        ProjectTask t1 = new ProjectTask();
        t1.setEstimatedHours(12.0);
        t1.setStatus(ProjectTask.Status.TODO);

        ProjectTask t2 = new ProjectTask();
        t2.setEstimatedHours(6.0);
        t2.setStatus(ProjectTask.Status.COMPLETED);

        when(taskRepository.findByProjectId(1L)).thenReturn(List.of(t1, t2));

        // 5 days, 1 dev -> capacity = 5 * 1 * 6 = 30 hours. Remaining = 12 hours.
        // loadRatio = 12 / 30 = 0.40 -> LOW risk
        Map<String, Object> forecast = plannerController.forecast(1L, 5, 1);

        assertEquals(2, forecast.get("totalTasks"));
        assertEquals(1L, forecast.get("completedTasks"));
        assertEquals(12.0, forecast.get("remainingHours"));
        assertEquals(0.4, (Double) forecast.get("loadRatio"), 0.01);
        assertEquals("LOW", forecast.get("risk"));
    }
}
