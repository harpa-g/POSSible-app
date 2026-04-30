package com.wad.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    private Long menuItemId;
    private String name;
    private double price;

    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.ACTIVE;

    private String removalReason;
    private LocalDateTime removedAt;

    public enum ItemStatus {
        ACTIVE, REMOVED
    }
}