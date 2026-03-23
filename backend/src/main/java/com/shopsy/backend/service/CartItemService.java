package com.shopsy.backend.service;

import com.shopsy.backend.model.CartItem;

public interface CartItemService {

    CartItem updateQuantity(Long cartItemId, int quantity);

    void deleteCartItem(Long cartItemId);

}