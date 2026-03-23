package com.shopsy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsy.backend.model.Address;
import com.shopsy.backend.model.Cart;
import com.shopsy.backend.model.CartItem;
import com.shopsy.backend.model.Order;
import com.shopsy.backend.model.OrderItem;
import com.shopsy.backend.model.OrderStatus;
import com.shopsy.backend.model.User;
import com.shopsy.backend.repository.AddressRepository;
import com.shopsy.backend.repository.CartItemRepository;
import com.shopsy.backend.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void deleteOrder(Long orderId) {
        Order order = getOrderById(orderId);
        orderRepository.delete(order);
    }

    @Override
    public Order placeOrder(Long userId, Address shippingAddress) {
        User user = userService.findUserById(userId);
        Cart cart = cartService.getCartByUser(userId);

        // Associate address with user and save it
        shippingAddress.setUser(user);
        shippingAddress = addressRepository.save(shippingAddress);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {
            BigDecimal price = BigDecimal.valueOf(ci.getProduct().getPrice());
            OrderItem oi = new OrderItem(null, ci.getProduct(), ci.getQuantity(), ci.getSize(), price);
            orderItems.add(oi);
            total = total.add(price.multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        Order order = new Order(user, orderItems, total, shippingAddress);
        order = orderRepository.save(order);

        // Clear cart items
        for (CartItem ci : cart.getItems()) {
            cartItemRepository.delete(ci);
        }

        return order;
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        User user = userService.findUserById(userId);
        return orderRepository.findByUser(user);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    @Override
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = getOrderById(orderId);
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }
        order.cancel();
        return orderRepository.save(order);
    }

    @Override
    public Order placeOrderFromCart(Long userId, Long orderId, Address shippingAddress) {
        User user = userService.findUserById(userId);
        Cart cart = cartService.getCartByUser(userId);

        // Get the existing order (created during payment)
        Order order = getOrderById(orderId);
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this order");
        }

        // Convert cart items to order items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {
            BigDecimal price = BigDecimal.valueOf(ci.getProduct().getPrice());
            OrderItem oi = new OrderItem(order, ci.getProduct(), ci.getQuantity(), ci.getSize(), price);
            orderItems.add(oi);
            total = total.add(price.multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        // Update order with items, address, and status
        order.setOrderItems(orderItems);
        order.setShippingAddress(shippingAddress);
        order.setStatus(OrderStatus.PAID);
        order.setTotalPrice(total);
        order = orderRepository.save(order);

        // Clear cart items
        for (CartItem ci : cart.getItems()) {
            cartItemRepository.delete(ci);
        }

        return order;
    }
}
