package com.election.service;

import com.election.exception.ResourceNotFoundException;
import com.election.model.*;
import com.election.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnomalyService {

    private final AnomalyRepository anomalyRepository;
    private final ElectionRepository electionRepository;

    public AnomalyService(AnomalyRepository anomalyRepository, ElectionRepository electionRepository) {
        this.anomalyRepository = anomalyRepository;
        this.electionRepository = electionRepository;
    }

    public List<Anomaly> getAllAnomalies() {
        return anomalyRepository.findAllByOrderByCreatedAtDesc();
    }

    public Anomaly getAnomalyById(Long id) {
        return anomalyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Anomaly not found with id: " + id));
    }

    public List<Anomaly> getAnomaliesByElection(Long electionId) {
        return anomalyRepository.findByElectionId(electionId);
    }

    public List<Anomaly> getAnomaliesByStatus(String status) {
        return anomalyRepository.findByStatus(status);
    }

    @Transactional
    public Anomaly createAnomaly(Anomaly anomaly, Long electionId, User reporter) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));
        anomaly.setElection(election);
        anomaly.setReportedBy(reporter);
        return anomalyRepository.save(anomaly);
    }

    @Transactional
    public Anomaly updateAnomalyStatus(Long id, String status) {
        Anomaly anomaly = getAnomalyById(id);
        anomaly.setStatus(status);
        if ("RESOLVED".equals(status) || "DISMISSED".equals(status)) {
            anomaly.setResolvedAt(LocalDateTime.now());
        }
        return anomalyRepository.save(anomaly);
    }

    @Transactional
    public void deleteAnomaly(Long id) {
        anomalyRepository.deleteById(id);
    }
}
