package com.election.repository;

import com.election.model.Election;
import com.election.model.ElectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findByStatus(ElectionStatus status);

    List<Election> findByRegion(String region);

    List<Election> findByOrderByElectionDateDesc();
}
