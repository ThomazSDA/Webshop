package com.Webshop.ClassAssignment.ItVitae.Webshop.controllers;

import com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.order.OrderDTO;
import com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.order.PlaceOrderRequestDTO;
import com.Webshop.ClassAssignment.ItVitae.Webshop.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrder(id, userDetails));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PlaceOrderRequestDTO request) {
        return ResponseEntity.ok(orderService.placeOrder(userDetails, request.shippingMethod()));
    }
}
