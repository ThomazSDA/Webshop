package com.Webshop.ClassAssignment.ItVitae.Webshop.enums;

import com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.shoppingCart.ShippingMethodDTO;

public enum ShippingMethod {
    POSTNL("PostNL", 4.95F),
    DHL("DHL", 5.95F),
    UPS("UPS", 6.95F);

    private final String displayName;
    private final float price;

    ShippingMethod(String displayName, float price) {
        this.displayName = displayName;
        this.price = price;
    }

    public String getDisplayName() {
        return displayName;
    }

    public float getPrice() {
        return price;
    }

    public ShippingMethodDTO toDTO() {
        return new ShippingMethodDTO(
                name(),
                displayName,
                price
        );
    }
}
