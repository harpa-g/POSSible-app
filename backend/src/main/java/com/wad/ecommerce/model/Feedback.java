package com.wad.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tabId;
    private Long menuItemId;
    private String reason;
    private boolean serverAcknowledged = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}