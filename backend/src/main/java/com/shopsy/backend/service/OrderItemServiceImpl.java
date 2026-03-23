package com.shopsy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsy.backend.model.Order;
import com.shopsy.backend.model.OrderItem;
import com.shopsy.backend.repository.OrderItemRepository;
import com.shopsy.backend.repository.OrderRepository;

import java.util.List;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<OrderItem> getOrderItemsByOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return orderItemRepository.findByOrder(order);
    }

}