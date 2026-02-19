package com.election.repository;

import com.election.model.Anomaly;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnomalyRepository extends JpaRepository<Anomaly, Long> {
    List<Anomaly> findByElectionId(Long electionId);

    List<Anomaly> findByReportedById(Long userId);

    List<Anomaly> findByStatus(String status);

    List<Anomaly> findBySeverity(String severity);

    List<Anomaly> findAllByOrderByCreatedAtDesc();
}
