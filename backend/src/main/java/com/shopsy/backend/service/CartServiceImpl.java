package com.shopsy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsy.backend.model.Cart;
import com.shopsy.backend.model.CartItem;
import com.shopsy.backend.model.Product;
import com.shopsy.backend.model.User;
import com.shopsy.backend.repository.CartItemRepository;
import com.shopsy.backend.repository.CartRepository;
import com.shopsy.backend.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartServiceImpl implements CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart createCart(Long userId) {
        logger.info("Creating cart for userId: {}", userId);
        User user = userService.findUserById(userId);
        logger.info("User found: {}", user);
        Cart existingCart = cartRepository.findByUser(user);
        logger.info("Existing cart: {}", existingCart);
        if (existingCart != null) {
            return existingCart;
        }
        logger.info("Creating new cart for user");
        Cart cart = new Cart(user);
        Cart savedCart = cartRepository.save(cart);
        logger.info("Cart saved: {}", savedCart);
        return savedCart;
    }

    @Override
    public Cart addItemToCart(Long cartId, Long productId, int quantity, String size) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Check if item already exists
        CartItem existingItem = cartItemRepository.findByCartAndProductAndSize(cart, product, size);
        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            // Create new item
            CartItem cartItem = new CartItem(cart, product, quantity, size);
            cartItemRepository.save(cartItem);
        }

        // Reload cart to include the updated/new item
        return cartRepository.findById(cartId).get();
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + cartItemId));
        Cart cart = cartItem.getCart();
        cartItemRepository.delete(cartItem);
        // Reload cart
        return cartRepository.findById(cart.getId()).get();
    }

    @Override
    public Cart getCartByUser(Long userId) {
        logger.info("Getting cart for userId: {}", userId);
        return createCart(userId);
    }

}