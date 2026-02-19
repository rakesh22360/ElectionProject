package com.election.repository;

import com.election.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByElectionIdAndVoterId(Long electionId, Long voterId);

    boolean existsByElectionIdAndVoterId(Long electionId, Long voterId);

    long countByElectionId(Long electionId);

    long countByCandidateId(Long candidateId);

    long countByElectionIdAndCandidateId(Long electionId, Long candidateId);

    @Query("SELECT v.candidate.id, v.candidate.name, v.candidate.party, COUNT(v) " +
            "FROM Vote v WHERE v.election.id = :electionId " +
            "GROUP BY v.candidate.id, v.candidate.name, v.candidate.party " +
            "ORDER BY COUNT(v) DESC")
    List<Object[]> getElectionResults(Long electionId);
}
