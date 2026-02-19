package com.election.service;

import com.election.dto.DashboardStats;
import com.election.model.ElectionStatus;
import com.election.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private final ElectionRepository electionRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final AnomalyRepository anomalyRepository;
    private final ReportRepository reportRepository;
    private final DiscussionRepository discussionRepository;

    public AnalyticsService(ElectionRepository electionRepository, VoteRepository voteRepository,
            UserRepository userRepository, AnomalyRepository anomalyRepository,
            ReportRepository reportRepository, DiscussionRepository discussionRepository) {
        this.electionRepository = electionRepository;
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.anomalyRepository = anomalyRepository;
        this.reportRepository = reportRepository;
        this.discussionRepository = discussionRepository;
    }

    public DashboardStats getDashboardStats() {
        return new DashboardStats(
                electionRepository.count(),
                electionRepository.findByStatus(ElectionStatus.ONGOING).size(),
                voteRepository.count(),
                userRepository.count(),
                anomalyRepository.count(),
                anomalyRepository.findByStatus("REPORTED").size() +
                        anomalyRepository.findByStatus("UNDER_REVIEW").size(),
                reportRepository.count(),
                discussionRepository.countByParentIsNull());
    }

    public double getVoterTurnout(Long electionId) {
        var election = electionRepository.findById(electionId);
        if (election.isPresent() && election.get().getTotalRegisteredVoters() > 0) {
            long votesCast = voteRepository.countByElectionId(electionId);
            return (votesCast * 100.0) / election.get().getTotalRegisteredVoters();
        }
        return 0;
    }
}
