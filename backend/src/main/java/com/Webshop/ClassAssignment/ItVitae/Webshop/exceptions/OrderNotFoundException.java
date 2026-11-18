package com.Webshop.ClassAssignment.ItVitae.Webshop.exceptions;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String message) {
        super(message);
    }
}
