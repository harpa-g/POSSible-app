package com.wad.ecommerce.model;

import com.wad.ecommerce.dto.OrderItemDto;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.List;

@Data
@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<OrderItemDto> items;

    private double totalPrice;
}