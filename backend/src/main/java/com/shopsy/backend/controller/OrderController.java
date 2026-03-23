package com.shopsy.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.shopsy.backend.model.Address;
import com.shopsy.backend.model.Order;
import com.shopsy.backend.model.OrderItem;
import com.shopsy.backend.model.OrderStatus;
import com.shopsy.backend.service.OrderService;
import com.shopsy.backend.service.OrderItemService;
import com.shopsy.backend.service.UserService;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Order management.
 * Provides endpoints for order creation, retrieval, and status updates.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private UserService userService;

    private Long getCurrentUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        return userService.findUserByEmail(email).getId();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        try {
            OrderStatus status = OrderStatus.valueOf(statusStr);
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("")
    public ResponseEntity<Order> placeOrder(@RequestBody Address shippingAddress) {
        Long userId = getCurrentUserId();
        Order order = orderService.placeOrder(userId, shippingAddress);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrderFromCart(@RequestBody Map<String, Object> request) {
        Long userId = getCurrentUserId();
        Long orderId = Long.valueOf(request.get("orderId").toString());

        // Extract address from request
        Map<String, Object> addressData = (Map<String, Object>) request.get("address");
        Address shippingAddress = new Address();
        shippingAddress.setFirstName((String) addressData.get("firstName"));
        shippingAddress.setLastName((String) addressData.get("lastName"));
        shippingAddress.setStreetAddress((String) addressData.get("address"));
        shippingAddress.setCity((String) addressData.get("city"));
        shippingAddress.setState((String) addressData.get("region"));
        shippingAddress.setZipCode((String) addressData.get("postalCode"));

        Order order = orderService.placeOrderFromCart(userId, orderId, shippingAddress);
        return ResponseEntity.ok(order);
    }

    @GetMapping("")
    public ResponseEntity<List<Order>> getUserOrders() {
        Long userId = getCurrentUserId();
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        try {
            Order order = orderService.getOrderById(id);
            if (!order.getUser().getId().equals(userId)) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Long userId = getCurrentUserId();
        Order order = orderService.getOrderById(id);
        if (!order.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        if (updates.containsKey("status")) {
            String statusStr = (String) updates.get("status");
            try {
                OrderStatus status = OrderStatus.valueOf(statusStr);
                order.setStatus(status);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        Order updatedOrder = orderService.updateOrder(order);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        orderService.cancelOrder(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable Long orderId) {
        Long userId = getCurrentUserId();
        Order order = orderService.getOrderById(orderId);
        if (!order.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        List<OrderItem> items = orderItemService.getOrderItemsByOrder(orderId);
        return ResponseEntity.ok(items);
    }
}
