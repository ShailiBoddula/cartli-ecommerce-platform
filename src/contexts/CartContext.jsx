import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const token = window.top.localStorage.getItem("jwt");
    const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    
    if (!token) {
      // If not authenticated, use local storage as fallback for this user
      const saved = window.top.localStorage.getItem(`cartItems_${userId}`);
      setCartItems(saved ? JSON.parse(saved) : []);
      return;
    }
    try {
      const response = await api.get('/cart');
      setCartItems(response.data.items || []);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(response.data.items || []));
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If authenticated but error, use local storage for this user
      const saved = window.top.localStorage.getItem(`cartItems_${userId}`);
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async ({ product, size, quantity }) => {
    const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    
    try {
      setLoading(true);

      if (!product || !product.id) {
        throw new Error("Product ID missing");
      }

      console.log("🛒 ADD TO CART:", {
        productId: product.id,
        size,
        quantity
      });

      const response = await api.post(
        `/cart/add/${product.id}`,
        {
          quantity,
          size
        }
      );

      setCartItems(response.data.items || []);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(response.data.items || []));
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Fallback to local storage for this user
      const updatedItems = cartItems.map(item =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      if (updatedItems.length === cartItems.length) {
        // No existing item, add new
        updatedItems.push({
          cartItemId: Date.now(),
          ...product,
          selectedSize: size,
          quantity,
          discountedPrice: product.discountedPrice || product.price
        });
      }
      setCartItems(updatedItems);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedItems));
    } finally {
      setLoading(false);
    }
  };




  const removeFromCart = async (cartItemId) => {
    const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    
    try {
      setLoading(true);
      const response = await api.delete(`/cart/remove/${cartItemId}`);
      setCartItems(response.data.items || []);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(response.data.items || []));
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback
      const updated = cartItems.filter(item => item.cartItemId !== cartItemId);
      setCartItems(updated);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      setLoading(true);
      const response = await api.put(`/cart/update/${cartItemId}`, {
        quantity
      });
      setCartItems(response.data.items || []);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(response.data.items || []));
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback
      const updated = cartItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      );
      setCartItems(updated);
      window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    setCartItems([]);
    window.top.localStorage.setItem(`cartItems_${userId}`, JSON.stringify([]));
  };

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.discountedPrice || 0) * item.quantity,
      0
    );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      fetchCart,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};
