package com.election.service;

import com.election.exception.ResourceNotFoundException;
import com.election.model.*;
import com.election.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final ElectionRepository electionRepository;

    public DiscussionService(DiscussionRepository discussionRepository, ElectionRepository electionRepository) {
        this.discussionRepository = discussionRepository;
        this.electionRepository = electionRepository;
    }

    public List<Discussion> getAllDiscussions() {
        return discussionRepository.findByParentIsNullOrderByCreatedAtDesc();
    }

    public Discussion getDiscussionById(Long id) {
        return discussionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
    }

    public List<Discussion> getDiscussionsByElection(Long electionId) {
        return discussionRepository.findByElectionIdAndParentIsNullOrderByCreatedAtDesc(electionId);
    }

    @Transactional
    public Discussion createDiscussion(Discussion discussion, Long electionId, User user) {
        if (electionId != null) {
            Election election = electionRepository.findById(electionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Election not found"));
            discussion.setElection(election);
        }
        discussion.setUser(user);
        return discussionRepository.save(discussion);
    }

    @Transactional
    public Discussion addReply(Long parentId, Discussion reply, User user) {
        Discussion parent = getDiscussionById(parentId);
        reply.setParent(parent);
        reply.setElection(parent.getElection());
        reply.setUser(user);
        return discussionRepository.save(reply);
    }

    @Transactional
    public void deleteDiscussion(Long id) {
        discussionRepository.deleteById(id);
    }
}
