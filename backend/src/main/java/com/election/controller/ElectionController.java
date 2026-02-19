package com.election.controller;

import com.election.dto.ElectionRequest;
import com.election.dto.ElectionResultDTO;
import com.election.model.*;
import com.election.service.AuthService;
import com.election.service.ElectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    private final ElectionService electionService;
    private final AuthService authService;

    public ElectionController(ElectionService electionService, AuthService authService) {
        this.electionService = electionService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Election>> getAllElections() {
        return ResponseEntity.ok(electionService.getAllElections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(electionService.getElectionById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Election>> getElectionsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(electionService.getElectionsByStatus(ElectionStatus.valueOf(status.toUpperCase())));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Election> createElection(@Valid @RequestBody ElectionRequest request) {
        User creator = authService.getCurrentUser();
        return ResponseEntity.ok(electionService.createElection(request, creator));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Election> updateElection(@PathVariable @NonNull Long id,
            @Valid @RequestBody ElectionRequest request) {
        return ResponseEntity.ok(electionService.updateElection(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteElection(@PathVariable @NonNull Long id) {
        electionService.deleteElection(id);
        return ResponseEntity.ok(Map.of("message", "Election deleted successfully"));
    }

    @GetMapping("/{id}/candidates")
    public ResponseEntity<List<Candidate>> getCandidates(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(electionService.getCandidates(id));
    }

    @PostMapping("/{id}/candidates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Candidate> addCandidate(@PathVariable @NonNull Long id,
            @Valid @RequestBody Candidate candidate) {
        return ResponseEntity.ok(electionService.addCandidate(id, candidate));
    }

    @DeleteMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCandidate(@PathVariable @NonNull Long candidateId) {
        electionService.deleteCandidate(candidateId);
        return ResponseEntity.ok(Map.of("message", "Candidate removed successfully"));
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("hasAnyRole('CITIZEN')")
    public ResponseEntity<?> castVote(@PathVariable @NonNull Long id, @RequestBody Map<String, Long> body) {
        User voter = authService.getCurrentUser();
        electionService.castVote(id,
                java.util.Objects.requireNonNull(body.get("candidateId"), "candidateId is required"), voter);
        return ResponseEntity.ok(Map.of("message", "Vote cast successfully"));
    }

    @GetMapping("/{id}/has-voted")
    public ResponseEntity<Map<String, Boolean>> hasVoted(@PathVariable @NonNull Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(Map.of("hasVoted", electionService.hasVoted(id, user.getId())));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<List<ElectionResultDTO>> getResults(@PathVariable Long id) {
        return ResponseEntity.ok(electionService.getElectionResults(id));
    }

    @GetMapping("/{id}/vote-count")
    public ResponseEntity<Map<String, Long>> getVoteCount(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("count", electionService.getVoteCount(id)));
    }
}
