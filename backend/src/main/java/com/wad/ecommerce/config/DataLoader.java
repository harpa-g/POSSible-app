package com.wad.ecommerce.config;

import com.wad.ecommerce.model.Product;
import com.wad.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return; // don't seed if already has data

        productRepository.saveAll(List.of(
            new Product(1L, "Car",    "Dacia Estafette",       1299.99, "http://localhost:8080/images/car.jpg"),
            new Product(2L, "Computer", "Felix PC",           199.99, "http://localhost:8080/images/pc.jpg"),
            new Product(3L, "Office", "Office Suite",    89.99,  "http://localhost:8080/images/office.jpg"),
            new Product(4L, "Windows",       "Windows XP",                   49.99, "http://localhost:8080/images/windows.jpg"),
            new Product(5L, "Cake",        "Traditional cake",          9.99,  "http://localhost:8080/images/cake.jpg")
    ));


        System.out.println("DataLoader: seeded 6 products.");
    }
}
