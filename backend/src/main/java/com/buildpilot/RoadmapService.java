package com.buildpilot;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoadmapService {

    public record Request(int days, int teamSize, int features) {}
    public record Phase(String name, int startDay, int endDay, List<String> tasks) {}
    public record Roadmap(String risk, double loadRatio, List<Phase> phases, List<String> priorities) {}

    private static final double[] SHARE = {0.15, 0.45, 0.20, 0.10, 0.10};
    private static final String[] NAMES = {"Design", "Build", "Testing", "Hardening", "Launch"};
    private static final List<List<String>> TASKS = List.of(
        List.of("Lock the scope", "Wireframes and component list"),
        List.of("Core features", "API and database", "Connect UI to API"),
        List.of("Unit and integration tests", "Cross-device checks"),
        List.of("Security review", "Accessibility pass", "Performance budget"),
        List.of("Deploy", "Monitor errors for 48 hours"));

    public Roadmap generate(Request r) {
        int days = Math.max(1, r.days());
        int team = Math.max(1, r.teamSize());
        // Assume each feature needs about 3 person-days.
        double ratio = (r.features() * 3.0) / (days * team);
        String risk = ratio > 1.0 ? "HIGH" : ratio > 0.7 ? "MEDIUM" : "LOW";

        List<Phase> phases = new ArrayList<>();
        int cursor = 1;
        for (int i = 0; i < NAMES.length; i++) {
            int length = Math.max(1, (int) Math.round(days * SHARE[i]));
            int end = i == NAMES.length - 1 ? Math.max(cursor, days) : Math.min(days, cursor + length - 1);
            phases.add(new Phase(NAMES[i], cursor, end, TASKS.get(i)));
            cursor = end + 1;
        }

        List<String> priorities = new ArrayList<>(List.of("Fix critical security issues first", "Ship the core user flow before extras"));
        if (risk.equals("HIGH")) priorities.add("Cut or postpone about " + (int) Math.ceil((ratio - 1.0) * r.features()) + " features to hit the deadline");
        return new Roadmap(risk, Math.round(ratio * 100) / 100.0, phases, priorities);
    }
}
