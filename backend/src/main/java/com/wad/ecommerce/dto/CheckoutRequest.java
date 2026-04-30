package com.wad.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {
    private List<OrderItemDto> items;
    private double totalPrice;
}