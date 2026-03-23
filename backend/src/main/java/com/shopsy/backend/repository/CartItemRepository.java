package com.shopsy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopsy.backend.model.Cart;
import com.shopsy.backend.model.CartItem;
import com.shopsy.backend.model.Product;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart(Cart cart);

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);

}