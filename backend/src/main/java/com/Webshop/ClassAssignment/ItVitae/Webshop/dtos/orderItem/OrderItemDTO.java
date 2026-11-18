package com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.orderItem;

import com.Webshop.ClassAssignment.ItVitae.Webshop.models.OrderItem;

public record OrderItemDTO(
        Long id,
        String productName,
        String ImageURL,
        float priceAtPurchase,
        int amount
) {
    public static OrderItemDTO fromEntity(OrderItem orderItem) {
        return new OrderItemDTO(
                orderItem.getId(),
                orderItem.getProductName(),
                orderItem.getImageURL(),
                orderItem.getPriceAtPurchase(),
                orderItem.getAmount()
        );
    }
}
