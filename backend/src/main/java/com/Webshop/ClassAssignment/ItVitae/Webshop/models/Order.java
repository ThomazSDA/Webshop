package com.Webshop.ClassAssignment.ItVitae.Webshop.models;

import com.Webshop.ClassAssignment.ItVitae.Webshop.enums.ShippingMethod;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User user;

    private float subTotalPrice;

    @Enumerated(EnumType.STRING)
    private ShippingMethod shippingMethod;

    private float shippingCost;

    private float totalPrice;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public float getSubTotalPrice() {
        return subTotalPrice;
    }
    public void setSubTotalPrice(float subTotalPrice) {
        this.subTotalPrice = subTotalPrice;
    }

    public ShippingMethod getShippingMethod() {
        return shippingMethod;
    }
    public void setShippingMethod(ShippingMethod shippingMethod) {
        this.shippingMethod = shippingMethod;
    }

    public float getShippingCost() {
        return shippingCost;
    }
    public void setShippingCost(float shippingCost) {
        this.shippingCost = shippingCost;
    }

    public float getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
