'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useUser();

  const getWishlistKey = useCallback(() => {
    return user ? `simuweb_wishlist_${user.email}` : 'simuweb_wishlist_guest';
  }, [user]);

  // This effect runs when the user logs in or out.
  useEffect(() => {
    try {
      const wishlistKey = getWishlistKey();
      const storedWishlist = localStorage.getItem(wishlistKey);
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      } else {
        // If no wishlist is found for the new user, clear the items.
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Failed to parse wishlist from localStorage', error);
      setWishlistItems([]);
    }
  }, [user, getWishlistKey]);

  // This effect runs whenever the wishlistItems state changes.
  useEffect(() => {
    try {
      const wishlistKey = getWishlistKey();
      // Do not save an empty wishlist if it's the initial state from a fresh load
      if (wishlistItems.length > 0 || localStorage.getItem(wishlistKey)) {
        localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
      }
    } catch (error) {
      console.error('Failed to save wishlist to localStorage', error);
    }
  }, [wishlistItems, getWishlistKey]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems(prevItems => {
      if (prevItems.some(item => item.id === product.id)) {
        return prevItems; // Already in wishlist
      }
      const newItems = [...prevItems, product];
      return newItems;
    });
    toast({
        title: "Ditambahkan ke Wishlist",
        description: `${product.name} telah ditambahkan ke daftar keinginan Anda.`,
    })
  }, [toast]);

  const removeFromWishlist = useCallback((productId: number) => {
    let removedItemName = '';
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        removedItemName = itemToRemove.name;
      }
      const newItems = prevItems.filter(item => item.id !== productId);
      return newItems;
    });

    if(removedItemName) {
        toast({
            variant: "destructive",
            title: "Dihapus dari Wishlist",
            description: `${removedItemName} telah dihapus dari daftar keinginan Anda.`,
        })
    }
  }, [toast]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const wishlistCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);
  
  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount,
  }), [wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
