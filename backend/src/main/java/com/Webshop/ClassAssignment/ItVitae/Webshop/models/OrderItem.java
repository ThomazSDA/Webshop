package com.Webshop.ClassAssignment.ItVitae.Webshop.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Order order;

    private String productName;
    private String ImageURL;
    private float priceAtPurchase;
    private int amount;

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }
    public void setOrder(Order order) {
        this.order = order;
    }

    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageURL() {
        return ImageURL;
    }
    public void setImageURL(String imageURL) {
        ImageURL = imageURL;
    }

    public float getPriceAtPurchase() {
        return priceAtPurchase;
    }
    public void setPriceAtPurchase(float priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public int getAmount() {
        return amount;
    }
    public void setAmount(int amount) {
        this.amount = amount;
    }
}
