package com.wad.ecommerce.controller;

import com.wad.ecommerce.model.MenuItem;
import com.wad.ecommerce.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getAll() {
        return menuItemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getById(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MenuItem create(@RequestBody MenuItem item) {
        return menuItemRepository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> update(@PathVariable Long id, @RequestBody MenuItem updated) {
        return menuItemRepository.findById(id).map(p -> {
            p.setName(updated.getName());
            p.setDescription(updated.getDescription());
            p.setPrice(updated.getPrice());
            p.setImage(updated.getImage());
            return ResponseEntity.ok(menuItemRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!menuItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}