package com.election.controller;

import com.election.model.Discussion;
import com.election.model.User;
import com.election.service.AuthService;
import com.election.service.DiscussionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {

    private final DiscussionService discussionService;
    private final AuthService authService;

    public DiscussionController(DiscussionService discussionService, AuthService authService) {
        this.discussionService = discussionService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Discussion>> getAllDiscussions() {
        return ResponseEntity.ok(discussionService.getAllDiscussions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discussion> getDiscussionById(@PathVariable Long id) {
        return ResponseEntity.ok(discussionService.getDiscussionById(id));
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<Discussion>> getByElection(@PathVariable Long electionId) {
        return ResponseEntity.ok(discussionService.getDiscussionsByElection(electionId));
    }

    @PostMapping
    public ResponseEntity<Discussion> createDiscussion(@RequestBody Discussion discussion,
            @RequestParam(required = false) Long electionId) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(discussionService.createDiscussion(discussion, electionId, user));
    }

    @PostMapping("/{id}/replies")
    public ResponseEntity<Discussion> addReply(@PathVariable Long id, @RequestBody Discussion reply) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(discussionService.addReply(id, reply, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscussion(@PathVariable Long id) {
        discussionService.deleteDiscussion(id);
        return ResponseEntity.ok(Map.of("message", "Discussion deleted successfully"));
    }
}
