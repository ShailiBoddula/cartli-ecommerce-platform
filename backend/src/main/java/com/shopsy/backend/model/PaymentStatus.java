package com.shopsy.backend.model;

/**
 * Enum representing the status of a payment.
 * Used with @Enumerated(EnumType.STRING) for database storage.
 */
public enum PaymentStatus {
    CREATED("Payment Created"),
    PAYMENT_PENDING("Awaiting Payment"),
    SUCCESS("Payment Successful"),
    FAILED("Payment Failed");

    private final String displayName;

    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
