package com.wad.ecommerce.controller;

import com.wad.ecommerce.model.Product;
import com.wad.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final ProductRepository productRepository;

    @GetMapping("/add")
    public ResponseEntity<Product> addToCart(@RequestParam Long pid) {
        return productRepository.findById(pid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
