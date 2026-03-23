package com.shopsy.backend.service;

import com.shopsy.backend.model.Cart;

public interface CartService {

    Cart createCart(Long userId);

    Cart addItemToCart(Long cartId, Long productId, int quantity, String size);

    Cart removeItemFromCart(Long cartItemId);

    Cart getCartByUser(Long userId);

}