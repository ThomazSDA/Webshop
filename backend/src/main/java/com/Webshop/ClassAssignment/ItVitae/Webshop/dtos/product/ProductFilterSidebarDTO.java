package com.Webshop.ClassAssignment.ItVitae.Webshop.dtos.product;

import java.util.List;

public record ProductFilterSidebarDTO(
        float minPrice,
        float maxPrice,
        List<String> categories,
        List<String> brands
) {}
