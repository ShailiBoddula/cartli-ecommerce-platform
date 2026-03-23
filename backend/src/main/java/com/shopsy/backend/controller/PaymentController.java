package com.shopsy.backend.controller;

import com.shopsy.backend.model.Order;
import com.shopsy.backend.model.OrderStatus;
import com.shopsy.backend.model.PaymentInformation;
import com.shopsy.backend.model.PaymentStatus;
import com.shopsy.backend.model.User;
import com.shopsy.backend.repository.OrderRepository;
import com.shopsy.backend.repository.PaymentInformationRepository;
import com.shopsy.backend.service.RazorpayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Payment Controller handling payment operations.
 * Supports fully mock Razorpay integration.
 * 
 * Payment Flow:
 * 1. Frontend calls /api/payment/create-order → Backend creates payment order
 * 2. Frontend calls /api/payment/verify → Backend verifies (mock) and updates status
 * 3. Frontend calls /api/orders/place → Backend creates the actual order
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private PaymentInformationRepository paymentRepo;

    @Autowired
    private OrderRepository orderRepo;

    /**
     * Creates a payment order and returns order details.
     * 
     * @param data Contains: amount (BigDecimal)
     * @param user Authenticated user
     * @return JSON with success status, orderId, amount
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody Map<String, Object> data,
            @AuthenticationPrincipal User user) {

        BigDecimal amount = new BigDecimal(data.get("amount").toString());

        // 1. Create PaymentInformation record
        PaymentInformation payment = new PaymentInformation();
        payment.setAmount(amount);
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus(PaymentStatus.CREATED);
        payment.setPaymentTime(LocalDateTime.now());
        payment.setUser(user);
        payment = paymentRepo.save(payment);

        // 2. Create mock Razorpay order
        Map<String, Object> razorpayOrder = razorpayService.createRazorpayOrder(amount);

        // 3. Update payment with Razorpay order ID
        payment.setRazorpayOrderId((String) razorpayOrder.get("id"));
        payment.setStatus(PaymentStatus.PAYMENT_PENDING);
        paymentRepo.save(payment);

        // 4. Return structured JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", razorpayOrder.get("id"));
        response.put("amount", amount);
        response.put("currency", "INR");
        response.put("paymentId", payment.getId());
        response.put("razorpayKeyId", "mock_key_id");

        return ResponseEntity.ok(response);
    }

    /**
     * Verifies payment and updates order/payment status.
     * 
     * @param data Contains: razorpay_order_id, razorpay_payment_id, razorpay_signature
     * @return Verification result with structured JSON
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        // 1. Find payment record
        PaymentInformation payment = paymentRepo.findByRazorpayOrderId(orderId);
        
        Map<String, Object> response = new HashMap<>();

        if (payment == null) {
            response.put("success", false);
            response.put("error", "PAYMENT_NOT_FOUND");
            response.put("message", "Payment record not found for order: " + orderId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // 2. Verify signature (mock)
        boolean isValid = razorpayService.verifyPayment(orderId, paymentId, signature);

        if (isValid) {
            // 3. Update payment status to SUCCESS
            payment.markAsSuccessful(paymentId, signature);
            payment.setPaymentTime(LocalDateTime.now());
            paymentRepo.save(payment);

            // 4. Find and update associated order
            Order order = payment.getOrder();
            if (order != null) {
                order.setStatus(OrderStatus.PAID);
                orderRepo.save(order);
            }

            response.put("success", true);
            response.put("message", "Payment verified successfully");
            response.put("paymentId", payment.getId());
            response.put("orderId", order != null ? order.getId() : null);
            response.put("razorpayPaymentId", paymentId);
            response.put("status", "SUCCESS");
            
            return ResponseEntity.ok(response);
        } else {
            // 5. Mark payment as failed
            payment.markAsFailed("Payment signature verification failed");
            paymentRepo.save(payment);

            response.put("success", false);
            response.put("error", "VERIFICATION_FAILED");
            response.put("message", "Payment verification failed - invalid signature");
            response.put("paymentId", payment.getId());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Simulates a successful payment for testing purposes.
     * 
     * @param data Contains: razorpay_order_id
     * @return Simulation result
     */
    @PostMapping("/simulate-success")
    public ResponseEntity<Map<String, Object>> simulatePaymentSuccess(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        PaymentInformation payment = paymentRepo.findByRazorpayOrderId(orderId);
        
        Map<String, Object> response = new HashMap<>();

        if (payment == null) {
            response.put("success", false);
            response.put("error", "PAYMENT_NOT_FOUND");
            response.put("message", "Payment record not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Simulate successful payment
        String mockPaymentId = "pay_sim_" + System.currentTimeMillis();
        String mockSignature = razorpayService.generateMockSignature(orderId, mockPaymentId);
        
        payment.markAsSuccessful(mockPaymentId, mockSignature);
        payment.setPaymentTime(LocalDateTime.now());
        paymentRepo.save(payment);

        Order order = payment.getOrder();
        if (order != null) {
            order.setStatus(OrderStatus.PAID);
            orderRepo.save(order);
        }

        response.put("success", true);
        response.put("message", "Payment simulated successfully");
        response.put("razorpayPaymentId", mockPaymentId);
        response.put("razorpaySignature", mockSignature);
        response.put("status", "SUCCESS");

        return ResponseEntity.ok(response);
    }
}
