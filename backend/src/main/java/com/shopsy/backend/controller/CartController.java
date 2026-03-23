package com.shopsy.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.shopsy.backend.model.Cart;
import com.shopsy.backend.model.CartItem;
import com.shopsy.backend.service.CartItemService;
import com.shopsy.backend.service.CartService;
import com.shopsy.backend.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private UserService userService;

    private Long getCurrentUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        logger.debug("Current user email from security context: {}", email);
        return userService.findUserByEmail(email).getId();
    }

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        logger.info("Get cart request");
        Long userId = getCurrentUserId();
        logger.debug("Fetching cart for user ID: {}", userId);
        Cart cart = cartService.getCartByUser(userId);
        return ResponseEntity.ok(cart);
    }

   @PostMapping("/add/{productId}")
public ResponseEntity<Cart> addItem(
        @PathVariable Long productId,
        @RequestBody Map<String, Object> request
) {
    logger.info("Add to cart request: {}, productId={}", request, productId);

    Long userId = getCurrentUserId();
    Cart cart = cartService.getCartByUser(userId);

    Integer quantity = (Integer) request.get("quantity");
    String size = (String) request.get("size");

    if (quantity == null || size == null) {
        return ResponseEntity.badRequest().build();
    }

    Cart updatedCart = cartService.addItemToCart(
            cart.getId(),
            productId,
            quantity,
            size
    );

    return ResponseEntity.ok(updatedCart);
}


    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long itemId) {
        logger.info("Remove item from cart: {}", itemId);
        Cart cart = cartService.removeItemFromCart(itemId);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(@PathVariable Long itemId, @RequestBody Map<String, Object> request) {
        logger.info("Update item quantity: {}, request: {}", itemId, request);
        int quantity = Integer.valueOf(request.get("quantity").toString());
        CartItem updatedItem = cartItemService.updateQuantity(itemId, quantity);
        return ResponseEntity.ok(updatedItem.getCart());
    }
}