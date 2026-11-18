package com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.cardItem;

import com.Webshop.ClassAssignment.ItVitae.Webshop.models.CartItem;
//import com.Webshop.ClassAssignment.ItVitae.Webshop.models.Product;
import com.fasterxml.jackson.annotation.JsonAlias;

public record CartItemCreateDTO(
        Long productId,
        int amount
) {
    public CartItem toEntity() {
        CartItem cartItem = new CartItem();
        cartItem.setAmount(this.amount);
        return cartItem;
    }
}
