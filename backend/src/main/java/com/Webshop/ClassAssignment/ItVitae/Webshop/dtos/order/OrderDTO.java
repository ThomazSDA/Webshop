package com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.order;

import com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.orderItem.OrderItemDTO;
import com.Webshop.ClassAssignment.ItVitae.Webshop.enums.ShippingMethod;
import com.Webshop.ClassAssignment.ItVitae.Webshop.models.Order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDTO(
        Long id,
        float subTotalPrice,
        float shippingCost,
        ShippingMethod shippingMethod,
        float totalPrice,
        LocalDateTime createdAt,
        List<OrderItemDTO> orderItems
) {
    public static OrderDTO fromEntity(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getSubTotalPrice(),
                order.getShippingCost(),
                order.getShippingMethod(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getItems().stream()
                        .map(OrderItemDTO::fromEntity)
                        .toList()
        );
    }
}
