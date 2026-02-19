package com.election.controller;

import com.election.dto.DashboardStats;
import com.election.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/turnout/{electionId}")
    public ResponseEntity<Map<String, Double>> getVoterTurnout(@PathVariable Long electionId) {
        return ResponseEntity.ok(Map.of("turnout", analyticsService.getVoterTurnout(electionId)));
    }
}
