package com.election.controller;

import com.election.model.Anomaly;
import com.election.model.User;
import com.election.service.AnomalyService;
import com.election.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/anomalies")
public class AnomalyController {

    private final AnomalyService anomalyService;
    private final AuthService authService;

    public AnomalyController(AnomalyService anomalyService, AuthService authService) {
        this.anomalyService = anomalyService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Anomaly>> getAllAnomalies() {
        return ResponseEntity.ok(anomalyService.getAllAnomalies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Anomaly> getAnomalyById(@PathVariable Long id) {
        return ResponseEntity.ok(anomalyService.getAnomalyById(id));
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<Anomaly>> getByElection(@PathVariable Long electionId) {
        return ResponseEntity.ok(anomalyService.getAnomaliesByElection(electionId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Anomaly>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(anomalyService.getAnomaliesByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OBSERVER', 'CITIZEN', 'ADMIN')")
    public ResponseEntity<Anomaly> createAnomaly(@RequestBody Anomaly anomaly,
            @RequestParam Long electionId) {
        User reporter = authService.getCurrentUser();
        return ResponseEntity.ok(anomalyService.createAnomaly(anomaly, electionId, reporter));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'OBSERVER')")
    public ResponseEntity<Anomaly> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(anomalyService.updateAnomalyStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnomaly(@PathVariable Long id) {
        anomalyService.deleteAnomaly(id);
        return ResponseEntity.ok(Map.of("message", "Anomaly deleted successfully"));
    }
}
