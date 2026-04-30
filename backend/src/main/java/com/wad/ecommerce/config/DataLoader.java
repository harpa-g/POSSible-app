package com.wad.ecommerce.config;

import com.wad.ecommerce.model.MenuItem;
import com.wad.ecommerce.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {
        if (menuItemRepository.count() > 0) return;

        menuItemRepository.saveAll(List.of(
                new MenuItem(null, "Espresso", "Strong Italian coffee", 2.50, "/images/espresso.jpg"),
                new MenuItem(null, "Cappuccino", "Espresso with steamed milk", 3.50, "/images/cappuccino.jpg"),
                new MenuItem(null, "Croissant", "Buttery French pastry", 2.80, "/images/croissant.jpg"),
                new MenuItem(null, "Cheesecake", "New York style", 5.00, "/images/cheesecake.jpg"),
                new MenuItem(null, "Tea", "Earl Grey", 2.00, "/images/tea.jpg")
        ));
        System.out.println("DataLoader: seeded 5 menu items.");
    }
}