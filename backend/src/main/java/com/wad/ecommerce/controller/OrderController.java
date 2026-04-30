package com.wad.ecommerce.controller;

import com.wad.ecommerce.dto.OrderItemDto;
import com.wad.ecommerce.dto.CheckoutRequest;
import com.wad.ecommerce.model.Order;
import com.wad.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CheckoutRequest request) {

        Order order = new Order();
        order.setUsername(userDetails.getUsername());
        order.setItems(request.getItems());
        order.setTotalPrice(request.getTotalPrice());

        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
    /* TODO 6-1: GET /api/orders. Then go to order.service.js */


}