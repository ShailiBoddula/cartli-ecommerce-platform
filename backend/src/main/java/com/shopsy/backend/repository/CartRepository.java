package com.shopsy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopsy.backend.model.Cart;
import com.shopsy.backend.model.User;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findByUser(User user);

}