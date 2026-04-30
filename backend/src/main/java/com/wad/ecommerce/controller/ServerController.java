package com.wad.ecommerce.controller;

import com.wad.ecommerce.model.Feedback;
import com.wad.ecommerce.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/server")
@RequiredArgsConstructor
public class ServerController {

    private final FeedbackRepository feedbackRepository;

    // Get all unacknowledged feedback (removals)
    @GetMapping("/feedbacks")
    public List<Feedback> getPendingFeedbacks() {
        return feedbackRepository.findByServerAcknowledgedFalse();
    }

    // Mark a feedback as acknowledged (server talked to customer)
    @PutMapping("/feedbacks/{id}/acknowledge")
    public ResponseEntity<?> acknowledge(@PathVariable Long id) {
        Feedback feedback = feedbackRepository.findById(id).orElse(null);
        if (feedback == null) return ResponseEntity.notFound().build();
        feedback.setServerAcknowledged(true);
        feedbackRepository.save(feedback);
        return ResponseEntity.ok().build();
    }
}