package com.wad.ecommerce.repository;

import com.wad.ecommerce.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCreatedAtAfter(LocalDateTime after);
    List<Feedback> findByServerAcknowledgedFalse();
}