package com.shopsy.backend.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Mock Razorpay Service for development/testing purposes.
 * 
 * This service simulates Razorpay payment flow without using real API calls.
 * Always returns mock data - ready for production upgrade to real Razorpay integration.
 */
@Service
public class RazorpayService {

    private static final String MOCK_KEY_ID = "mock_key_id";
    private static final String MOCK_KEY_SECRET = "mock_key_secret";

    /**
     * Creates a mock Razorpay order.
     * 
     * @param amount Order amount in rupees
     * @return Mock order details
     */
    public Map<String, Object> createRazorpayOrder(BigDecimal amount) {
        Map<String, Object> mockOrder = new HashMap<>();
        mockOrder.put("id", "order_mock_" + System.currentTimeMillis());
        mockOrder.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue()); // Convert to paise
        mockOrder.put("currency", "INR");
        mockOrder.put("status", "created");
        mockOrder.put("key_id", MOCK_KEY_ID);
        return mockOrder;
    }

    /**
     * Verifies mock payment.
     * Returns true unless signature contains "fail".
     * 
     * @param orderId Razorpay order ID
     * @param paymentId Razorpay payment ID
     * @param signature Razorpay signature
     * @return true if signature is valid
     */
    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        // Mock verification: check for simulated failure signature
        if (signature != null && signature.toLowerCase().contains("fail")) {
            return false;
        }
        // All other signatures are valid
        return true;
    }

    /**
     * Generates mock signature for testing.
     * 
     * @param orderId Razorpay order ID
     * @param paymentId Razorpay payment ID
     * @return Mock signature
     */
    public String generateMockSignature(String orderId, String paymentId) {
        return "sig_mock_" + System.currentTimeMillis() + "_" + orderId;
    }
}
