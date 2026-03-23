package com.shopsy.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing payment information for an order.
 * Stores payment transaction details and status.
 * 
 * Note: Sensitive card data is NOT stored for security compliance.
 * In production, use PCI-compliant payment gateways like Razorpay
 * to handle card data securely.
 */
@Entity
@Table(name = "payment_information")
public class PaymentInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column
    private PaymentStatus status;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 100)
    private String paymentMethod;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    public PaymentInformation() {
        this.status = PaymentStatus.CREATED;
        this.paymentTime = LocalDateTime.now();
    }

    public PaymentInformation(BigDecimal amount, String paymentMethod, User user) {
        this();
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.user = user;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    /**
     * Marks payment as successful with all transaction details.
     */
    public void markAsSuccessful(String paymentId, String signature) {
        this.status = PaymentStatus.SUCCESS;
        this.razorpayPaymentId = paymentId;
        this.razorpaySignature = signature;
        this.paymentTime = LocalDateTime.now();
        this.errorMessage = null;
    }

    /**
     * Marks payment as failed with error message.
     */
    public void markAsFailed(String errorMessage) {
        this.status = PaymentStatus.FAILED;
        this.errorMessage = errorMessage;
    }
}
