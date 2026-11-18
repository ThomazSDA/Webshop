package com.Webshop.ClassAssignment.ItVitae.Webshop.services;

import com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.order.OrderDTO;
import com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.order.PlaceOrderRequestDTO;
import com.Webshop.ClassAssignment.ItVitae.Webshop.enums.ShippingMethod;
import com.Webshop.ClassAssignment.ItVitae.Webshop.exceptions.OrderNotFoundException;
import com.Webshop.ClassAssignment.ItVitae.Webshop.exceptions.UserNotFoundException;
import com.Webshop.ClassAssignment.ItVitae.Webshop.models.*;
import com.Webshop.ClassAssignment.ItVitae.Webshop.models.Product.Product;
import com.Webshop.ClassAssignment.ItVitae.Webshop.repositories.OrderRepository;
import com.Webshop.ClassAssignment.ItVitae.Webshop.repositories.ShoppingCartRepository;
import com.Webshop.ClassAssignment.ItVitae.Webshop.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ShoppingCartRepository shoppingCartRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ShoppingCartRepository shoppingCartRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.shoppingCartRepository = shoppingCartRepository;
    }

    public OrderDTO getOrder(Long id, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found with Email: " + userDetails.getUsername()));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not your order");
        }

        return OrderDTO.fromEntity(order);
    }

    @Transactional
    public OrderDTO placeOrder(UserDetails userDetails, ShippingMethod shippingMethod) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found with Email: " + userDetails.getUsername()));

        ShoppingCart shoppingCart = shoppingCartRepository.findByUserAndActiveTrue(user)
                .orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setShippingMethod(shippingMethod);
        order.setShippingCost(shippingMethod.getPrice());
//        order.setSubTotalPrice();
        order.setCreatedAt(LocalDateTime.now());
        //TODO setStatus (PAID, DELIVERED etc)


        List<OrderItem> items = new ArrayList<>();
        float total = 0;

        for (CartItem cartItem : shoppingCart.getCartItemList()) {
            Product product = cartItem.getProduct();

            if (cartItem.getAmount() > product.getStock()) {
                throw new IllegalStateException("Not enough stock");
            }

            product.setStock(product.getStock() - cartItem.getAmount());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setImageURL(product.getImageURL());
            orderItem.setProductName(product.getProductBase().getName());
            orderItem.setPriceAtPurchase(product.getPrice() * product.getSalePercentage());
            orderItem.setAmount(cartItem.getAmount());

            total += orderItem.getPriceAtPurchase() * orderItem.getAmount();
            items.add(orderItem);
        }

        total = Math.round(total * 100f) / 100f;

        order.setItems(items);
        order.setSubTotalPrice(total);
        order.setTotalPrice(total + order.getShippingCost());

        shoppingCart.setActive(false);
        shoppingCart.getCartItemList().clear();

        return OrderDTO.fromEntity(orderRepository.save(order));
    }
}
