package com.wad.ecommerce.controller;

import com.wad.ecommerce.model.Tab;
import com.wad.ecommerce.repository.TabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
@RequiredArgsConstructor
public class PaymentController {

    private final TabRepository tabRepository;

    @Value("${revolut.api-key}")
    private String revolutApiKey;

    // Simulate creating a Revolut order and redirecting
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> body, Principal principal) {
        int tableNumber = (int) body.get("tableNumber");
        double amount = ((Number) body.get("amount")).doubleValue(); // customer paid amount

        String username = principal.getName();
        Tab tab = tabRepository.findByTableNumberAndCustomerUsernameAndPaymentStatus(
                        tableNumber, username, Tab.PaymentStatus.PENDING)
                .orElse(null);
        if (tab == null) return ResponseEntity.badRequest().body("No active tab found.");

        // Compute total bill from active items
        double billTotal = tab.getItems().stream()
                .filter(i -> i.getStatus() == com.wad.ecommerce.model.OrderItem.ItemStatus.ACTIVE)
                .mapToDouble(com.wad.ecommerce.model.OrderItem::getPrice)
                .sum();

        if (amount < billTotal) {
            return ResponseEntity.badRequest().body("Amount must be at least the bill total.");
        }

        // Simulate Revolut order creation: generate a fake order ID
        String revolutOrderId = "REV-" + System.currentTimeMillis();
        tab.setRevolutOrderId(revolutOrderId);
        tab.setTotalBill(billTotal);
        tab.setPaidAmount(amount);
        tab.setPaymentStatus(Tab.PaymentStatus.PAID);
        tabRepository.save(tab);

        // In a real app, you would redirect to Revolut’s hosted payment page.
        // Here we simulate a success redirect back to our frontend.
        return ResponseEntity.ok(Map.of(
                "redirectUrl", "http://localhost:3000/payment-success?table=" + tableNumber + "&amount=" + amount
        ));
    }
}