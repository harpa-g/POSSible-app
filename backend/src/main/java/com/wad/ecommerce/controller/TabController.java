package com.wad.ecommerce.controller;

import com.wad.ecommerce.model.*;
import com.wad.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tabs")
@RequiredArgsConstructor
public class TabController {

    private final TabRepository tabRepository;
    private final MenuItemRepository menuItemRepository;
    private final FeedbackRepository feedbackRepository;

    // Get current tab for the authenticated customer (table number sent by frontend)
    @GetMapping("/{tableNumber}")
    public ResponseEntity<?> getTab(@PathVariable int tableNumber, Principal principal) {
        String username = principal.getName();
        // Look for an open tab for this table/customer
        Optional<Tab> optTab = tabRepository.findByTableNumberAndCustomerUsernameAndPaymentStatus(
                tableNumber, username, Tab.PaymentStatus.PENDING);
        Tab tab;
        if (optTab.isPresent()) {
            tab = optTab.get();
        } else {
            // Create a new empty tab
            tab = Tab.builder()
                    .tableNumber(tableNumber)
                    .customerUsername(username)
                    .paymentStatus(Tab.PaymentStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .items(new java.util.ArrayList<>())
                    .build();
            tab = tabRepository.save(tab);
        }
        // Compute total bill from active items
        double total = tab.getItems().stream()
                .filter(i -> i.getStatus() == OrderItem.ItemStatus.ACTIVE)
                .mapToDouble(OrderItem::getPrice)
                .sum();
        tab.setTotalBill(total);
        return ResponseEntity.ok(tab);
    }

    // Add an item to the tab (in real app, server would use a different endpoint)
    @PostMapping("/{tableNumber}/add")
    public ResponseEntity<?> addItem(@PathVariable int tableNumber,
                                     @RequestBody Map<String, Long> body,
                                     Principal principal) {
        Long menuItemId = body.get("menuItemId");
        Optional<MenuItem> optItem = menuItemRepository.findById(menuItemId);
        if (optItem.isEmpty()) return ResponseEntity.notFound().build();

        MenuItem menuItem = optItem.get();
        String username = principal.getName();
        // Get or create tab
        Tab tab = tabRepository.findByTableNumberAndCustomerUsernameAndPaymentStatus(
                        tableNumber, username, Tab.PaymentStatus.PENDING)
                .orElseGet(() -> Tab.builder()
                        .tableNumber(tableNumber)
                        .customerUsername(username)
                        .paymentStatus(Tab.PaymentStatus.PENDING)
                        .items(new java.util.ArrayList<>())
                        .createdAt(LocalDateTime.now())
                        .build());

        // Add item as active
        OrderItem orderItem = OrderItem.builder()
                .menuItemId(menuItem.getId())
                .name(menuItem.getName())
                .price(menuItem.getPrice())
                .status(OrderItem.ItemStatus.ACTIVE)
                .build();
        tab.getItems().add(orderItem);
        tab = tabRepository.save(tab);
        return ResponseEntity.ok(tab);
    }

    // Remove an item with a reason
    @DeleteMapping("/{tableNumber}/items/{menuItemId}")
    public ResponseEntity<?> removeItem(@PathVariable int tableNumber,
                                        @PathVariable Long menuItemId,
                                        @RequestBody Map<String, String> body,
                                        Principal principal) {
        String reason = body.get("reason");
        if (reason == null || reason.trim().isEmpty())
            return ResponseEntity.badRequest().body("Reason is required.");

        String username = principal.getName();
        Optional<Tab> optTab = tabRepository.findByTableNumberAndCustomerUsernameAndPaymentStatus(
                tableNumber, username, Tab.PaymentStatus.PENDING);
        if (optTab.isEmpty()) return ResponseEntity.notFound().build();

        Tab tab = optTab.get();
        // Find the active item
        Optional<OrderItem> itemOpt = tab.getItems().stream()
                .filter(i -> i.getMenuItemId().equals(menuItemId) && i.getStatus() == OrderItem.ItemStatus.ACTIVE)
                .findFirst();

        if (itemOpt.isEmpty()) return ResponseEntity.notFound().build();

        OrderItem item = itemOpt.get();
        item.setStatus(OrderItem.ItemStatus.REMOVED);
        item.setRemovalReason(reason);
        item.setRemovedAt(LocalDateTime.now());

        // Record feedback for server/owner
        Feedback feedback = Feedback.builder()
                .tabId(tab.getId())
                .menuItemId(menuItemId)
                .reason(reason)
                .build();
        feedbackRepository.save(feedback);

        tabRepository.save(tab);
        return ResponseEntity.ok("Item removed and feedback recorded.");
    }
}