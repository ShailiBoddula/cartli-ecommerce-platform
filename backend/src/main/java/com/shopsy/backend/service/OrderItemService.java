package com.shopsy.backend.service;

import com.shopsy.backend.model.OrderItem;

import java.util.List;

public interface OrderItemService {

    List<OrderItem> getOrderItemsByOrder(Long orderId);

}