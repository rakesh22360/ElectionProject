package com.election.service;

import com.election.dto.ElectionRequest;
import com.election.dto.ElectionResultDTO;
import com.election.exception.ResourceNotFoundException;
import com.election.model.*;
import com.election.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;

    public ElectionService(ElectionRepository electionRepository, CandidateRepository candidateRepository,
            VoteRepository voteRepository) {
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
        this.voteRepository = voteRepository;
    }

    public List<Election> getAllElections() {
        return electionRepository.findByOrderByElectionDateDesc();
    }

    public Election getElectionById(Long id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found with id: " + id));
    }

    public List<Election> getElectionsByStatus(ElectionStatus status) {
        return electionRepository.findByStatus(status);
    }

    @Transactional
    public Election createElection(ElectionRequest request, User creator) {
        Election election = new Election();
        election.setName(request.getName());
        election.setDescription(request.getDescription());
        election.setElectionDate(request.getElectionDate());
        election.setStatus(request.getStatus() != null ? ElectionStatus.valueOf(request.getStatus())
                : ElectionStatus.UPCOMING);
        election.setRegion(request.getRegion());
        election.setTotalRegisteredVoters(request.getTotalRegisteredVoters());
        election.setCreatedBy(creator);
        return electionRepository.save(election);
    }

    @Transactional
    public Election updateElection(Long id, ElectionRequest request) {
        Election election = getElectionById(id);
        election.setName(request.getName());
        election.setDescription(request.getDescription());
        election.setElectionDate(request.getElectionDate());
        if (request.getStatus() != null) {
            election.setStatus(ElectionStatus.valueOf(request.getStatus()));
        }
        election.setRegion(request.getRegion());
        election.setTotalRegisteredVoters(request.getTotalRegisteredVoters());
        return electionRepository.save(election);
    }

    @Transactional
    public void deleteElection(Long id) {
        electionRepository.deleteById(id);
    }

    public List<Candidate> getCandidates(Long electionId) {
        return candidateRepository.findByElectionId(electionId);
    }

    @Transactional
    public Candidate addCandidate(Long electionId, Candidate candidate) {
        Election election = getElectionById(electionId);
        candidate.setElection(election);
        return candidateRepository.save(candidate);
    }

    @Transactional
    public void deleteCandidate(Long candidateId) {
        candidateRepository.deleteById(candidateId);
    }

    @Transactional
    public Vote castVote(Long electionId, Long candidateId, User voter) {
        Election election = getElectionById(electionId);
        if (election.getStatus() != ElectionStatus.ONGOING) {
            throw new RuntimeException("Election is not currently active");
        }
        if (voteRepository.existsByElectionIdAndVoterId(electionId, voter.getId())) {
            throw new RuntimeException("You have already voted in this election");
        }
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        Vote vote = new Vote();
        vote.setElection(election);
        vote.setCandidate(candidate);
        vote.setVoter(voter);
        return voteRepository.save(vote);
    }

    public boolean hasVoted(Long electionId, Long userId) {
        return voteRepository.existsByElectionIdAndVoterId(electionId, userId);
    }

    public long getVoteCount(Long electionId) {
        return voteRepository.countByElectionId(electionId);
    }

    public List<ElectionResultDTO> getElectionResults(Long electionId) {
        List<Candidate> candidates = candidateRepository.findByElectionId(electionId);
        long totalVotes = voteRepository.countByElectionId(electionId);

        return candidates.stream().map(candidate -> {
            long voteCount = voteRepository.countByCandidateId(candidate.getId());
            double percentage = totalVotes > 0 ? (voteCount * 100.0 / totalVotes) : 0;
            ElectionResultDTO dto = new ElectionResultDTO();
            dto.setCandidateId(candidate.getId());
            dto.setCandidateName(candidate.getName());
            dto.setParty(candidate.getParty());
            dto.setVoteCount(voteCount);
            dto.setPercentage(percentage);
            return dto;
        }).collect(Collectors.toList());
    }
}
