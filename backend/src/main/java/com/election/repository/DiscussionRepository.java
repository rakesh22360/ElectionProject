package com.election.repository;

import com.election.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findByElectionIdAndParentIsNullOrderByCreatedAtDesc(Long electionId);

    List<Discussion> findByParentIsNullOrderByCreatedAtDesc();

    List<Discussion> findByParentId(Long parentId);

    List<Discussion> findByUserId(Long userId);

    long countByParentIsNull();
}
