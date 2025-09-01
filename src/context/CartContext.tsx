'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { db } from '@/lib/db';
import { products as allProducts } from '@/lib/products';

const GUEST_CART_KEY = 'simuweb_cart_guest';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean; // Tetap ada untuk skeleton UI
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();

  const fetchDbCart = useCallback(async (userId: number): Promise<CartItem[]> => {
    if (!db) return [];
    try {
      // Joining with products to get all details, as cart_items only stores IDs.
      const result = await db.execute({
        sql: `
          SELECT p.id, p.name, p.price, p.description, p.longDescription, p.image, p.dataAiHint, ci.quantity
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          WHERE ci.user_id = ?
        `,
        args: [userId],
      });
      
      return result.rows.map((row: any) => ({
        product: {
          id: row.id,
          name: row.name,
          price: row.price,
          description: row.description,
          longDescription: row.longDescription,
          image: row.image,
          dataAiHint: row.dataAiHint,
        },
        quantity: row.quantity,
      }));
    } catch (error) {
      console.error("Failed to fetch cart from DB:", error);
      toast({ variant: 'destructive', title: "Error", description: "Could not load your cart." });
      return [];
    }
  }, [toast]);
  
  const migrateGuestCartToDb = useCallback(async (userId: number) => {
    // Migrasi hanya terjadi jika DB siap
    if (!db) return;
    try {
      const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
      if (!guestCartJson) return;

      const guestCart: CartItem[] = JSON.parse(guestCartJson);
      if (guestCart.length === 0) return;

      const statements = guestCart.map(item => ({
        sql: 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + excluded.quantity',
        args: [userId, item.product.id, item.quantity],
      }));

      await db.batch(statements, 'write');
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error("Failed to migrate guest cart:", error);
    }
  }, []);


  useEffect(() => {
    if (isUserLoading) {
      // Jika status user masih loading, jangan lakukan apa-apa.
      // Ini mencegah pengambilan data yang prematur.
      return;
    }

    const loadCart = async () => {
      if (user) {
        // User is logged in
        await migrateGuestCartToDb(user.id);
        const dbCart = await fetchDbCart(user.id);
        setCartItems(dbCart);
      } else {
        // User is a guest
        const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
        setCartItems(guestCartJson ? JSON.parse(guestCartJson) : []);
      }
    };

    loadCart();
  }, [user, isUserLoading, fetchDbCart, migrateGuestCartToDb]);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (!user) {
      // Guest user: update localStorage
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        let newItems;
        if (existingItem) {
          newItems = prevItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prevItems, { product, quantity }];
        }
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
        return newItems;
      });
    } else if (db) {
       // Logged-in user: update database
      try {
        await db.execute({
          sql: 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + ?',
          args: [user.id, product.id, quantity, quantity],
        });
        // Fetch the entire cart again to ensure consistency
        const updatedCart = await fetchDbCart(user.id);
        setCartItems(updatedCart);
      } catch (error) {
        console.error("Failed to add to DB cart:", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not add item to cart." });
        return;
      }
    }

    toast({
        title: "Ditambahkan ke Keranjang",
        description: `${product.name} telah ditambahkan ke keranjang Anda.`,
    });
  }, [user, toast, fetchDbCart]);

  const removeFromCart = useCallback(async (productId: number) => {
    const productName = allProducts.find(p => p.id === productId)?.name || 'Item';
    if (!user) {
       // Guest user: update localStorage
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => item.product.id !== productId);
        if (newItems.length > 0) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
        }
        return newItems;
      });
    } else if (db) {
      try {
        await db.execute({
            sql: 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            args: [user.id, productId],
        });
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
      } catch (error) {
        console.error("Failed to remove from DB cart:", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not remove item from cart." });
        return;
      }
    }
    toast({
      title: "Item Dihapus",
      description: `${productName} telah dihapus dari keranjang Anda.`,
    });
  }, [user, toast]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (!user) {
        // Guest user: update localStorage
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
            return newItems;
        });
    } else if (db) {
        try {
            await db.execute({
                sql: 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
                args: [quantity, user.id, productId],
            });
            setCartItems(prev => prev.map(item => item.product.id === productId ? {...item, quantity} : item));
        } catch(error) {
             console.error("Failed to update DB cart:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not update item quantity." });
        }
    }
  }, [user, toast, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (!user) {
        // Guest user
        setCartItems([]);
        localStorage.removeItem(GUEST_CART_KEY);
    } else if (db) {
      try {
        await db.execute({
          sql: 'DELETE FROM cart_items WHERE user_id = ?',
          args: [user.id],
        });
        setCartItems([]);
      } catch (error) {
        console.error("Failed to clear DB cart:", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not clear your cart." });
        return;
      }
    }
  }, [user, toast]);

  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0), [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isLoading: isUserLoading, // isLoading sekarang mencerminkan status user
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, isUserLoading]);

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
