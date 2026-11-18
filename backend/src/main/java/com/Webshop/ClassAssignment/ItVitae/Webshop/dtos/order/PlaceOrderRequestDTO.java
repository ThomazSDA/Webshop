package com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.order;

import com.Webshop.ClassAssignment.ItVitae.Webshop.enums.ShippingMethod;

public record PlaceOrderRequestDTO(
        ShippingMethod shippingMethod
) {}
