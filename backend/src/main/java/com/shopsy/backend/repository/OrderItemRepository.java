package com.shopsy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopsy.backend.model.Order;
import com.shopsy.backend.model.OrderItem;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);

}