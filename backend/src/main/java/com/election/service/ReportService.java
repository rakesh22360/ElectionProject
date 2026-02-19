package com.election.service;

import com.election.exception.ResourceNotFoundException;
import com.election.model.*;
import com.election.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ElectionRepository electionRepository;

    public ReportService(ReportRepository reportRepository, ElectionRepository electionRepository) {
        this.reportRepository = reportRepository;
        this.electionRepository = electionRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
    }

    public List<Report> getReportsByElection(Long electionId) {
        return reportRepository.findByElectionId(electionId);
    }

    @Transactional
    public Report createReport(Report report, Long electionId, User creator) {
        if (electionId != null) {
            Election election = electionRepository.findById(electionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Election not found"));
            report.setElection(election);
        }
        report.setCreatedBy(creator);
        return reportRepository.save(report);
    }

    @Transactional
    public Report updateReport(Long id, Report updated) {
        Report report = getReportById(id);
        report.setTitle(updated.getTitle());
        report.setContent(updated.getContent());
        report.setType(updated.getType());
        return reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
}
