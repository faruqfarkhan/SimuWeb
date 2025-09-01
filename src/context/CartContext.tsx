'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useUser();

  const getCartKey = useCallback(() => {
    return user ? `simuweb_cart_${user.email}` : 'simuweb_cart_guest';
  }, [user]);

  // This effect runs when the user logs in or out.
  // It loads the cart corresponding to the new user state.
  useEffect(() => {
    try {
      const cartKey = getCartKey();
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        // If no cart is found for the new user, clear the items.
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setCartItems([]);
    }
  }, [user, getCartKey]);

  // This effect runs whenever the cartItems state changes.
  // It saves the current cart to the correct user-specific storage.
  useEffect(() => {
    try {
      const cartKey = getCartKey();
      // Do not save an empty cart if it's the initial state from a fresh load
      if (cartItems.length > 0 || localStorage.getItem(cartKey)) {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [cartItems, getCartKey]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    toast({
        title: "Ditambahkan ke Keranjang",
        description: `${product.name} telah ditambahkan ke keranjang Anda.`,
    })
  }, [toast]);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      const newItems = prevItems.filter(item => item.product.id !== productId);
      if (itemToRemove) {
        toast({
            title: "Item Dihapus",
            description: `${itemToRemove.product.name} telah dihapus dari keranjang Anda.`,
        })
      }
      return newItems;
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
