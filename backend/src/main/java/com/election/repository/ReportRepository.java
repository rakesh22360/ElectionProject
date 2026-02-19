package com.election.repository;

import com.election.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByElectionId(Long electionId);

    List<Report> findByCreatedById(Long userId);

    List<Report> findByType(String type);

    List<Report> findAllByOrderByCreatedAtDesc();
}
