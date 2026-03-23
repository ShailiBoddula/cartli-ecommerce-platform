package com.shopsy.backend.model;

/**
 * Enum representing the status of an order.
 * Used with @Enumerated(EnumType.STRING) for database storage.
 */
public enum OrderStatus {
    CREATED("Order Created"),
    PAID("Payment Received"),
    SHIPPED("Order Shipped"),
    DELIVERED("Order Delivered"),
    CANCELLED("Order Cancelled");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
