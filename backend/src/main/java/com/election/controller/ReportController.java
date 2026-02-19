package com.election.controller;

import com.election.model.Report;
import com.election.model.User;
import com.election.service.AuthService;
import com.election.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;

    public ReportController(ReportService reportService, AuthService authService) {
        this.reportService = reportService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<Report>> getByElection(@PathVariable Long electionId) {
        return ResponseEntity.ok(reportService.getReportsByElection(electionId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN', 'OBSERVER')")
    public ResponseEntity<Report> createReport(@RequestBody Report report,
            @RequestParam(required = false) Long electionId) {
        User creator = authService.getCurrentUser();
        return ResponseEntity.ok(reportService.createReport(report, electionId, creator));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<Report> updateReport(@PathVariable Long id, @RequestBody Report report) {
        return ResponseEntity.ok(reportService.updateReport(id, report));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
    }
}
