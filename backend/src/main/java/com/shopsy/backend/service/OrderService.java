package com.shopsy.backend.service;

import com.shopsy.backend.model.Order;
import com.shopsy.backend.model.OrderStatus;

import java.util.List;

public interface OrderService {

    Order placeOrder(Long userId, com.shopsy.backend.model.Address shippingAddress);

    List<Order> getOrdersByUser(Long userId);

    List<Order> getAllOrders();

    Order updateOrderStatus(Long orderId, OrderStatus status);

    Order getOrderById(Long orderId);

    Order updateOrder(Order order);

    Order cancelOrder(Long orderId, Long userId);

    void deleteOrder(Long orderId);

    Order placeOrderFromCart(Long userId, Long orderId, com.shopsy.backend.model.Address shippingAddress);

}
