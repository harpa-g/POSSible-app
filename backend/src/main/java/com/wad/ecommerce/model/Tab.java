package com.wad.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tabs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int tableNumber;
    private String customerUsername;   // username of the customer who opened the tab

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tab_items", joinColumns = @JoinColumn(name = "tab_id"))
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String revolutOrderId;     // simulated
    private double totalBill;          // sum of active items (computed before payment)
    private double paidAmount;         // amount customer chose

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PaymentStatus {
        PENDING, PAID, FAILED
    }
}