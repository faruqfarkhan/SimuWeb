'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { db } from '@/lib/db';
import { products as allProducts } from '@/lib/products';

const GUEST_WISHLIST_KEY = 'simuweb_wishlist_guest';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();

  const fetchDbWishlist = useCallback(async (userId: number): Promise<Product[]> => {
    if (!db) return [];
    try {
        const result = await db.execute({
            sql: `
                SELECT p.id, p.name, p.price, p.description, p.longDescription, p.image, p.dataAiHint
                FROM wishlist_items wi
                JOIN products p ON wi.product_id = p.id
                WHERE wi.user_id = ?
            `,
            args: [userId],
        });
        return result.rows as Product[];
    } catch (error) {
        console.error("Failed to fetch wishlist from DB:", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not load your wishlist." });
        return [];
    }
  }, [toast]);
  
  const migrateGuestWishlistToDb = async (userId: number) => {
    try {
      const guestWishlistJson = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (!guestWishlistJson) return;

      const guestWishlist: Product[] = JSON.parse(guestWishlistJson);
      if (guestWishlist.length === 0 || !db) return;

      const statements = guestWishlist.map(item => ({
        sql: 'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?) ON CONFLICT DO NOTHING',
        args: [userId, item.id],
      }));

      await db.batch(statements, 'write');
      localStorage.removeItem(GUEST_WISHLIST_KEY);
    } catch (error) {
      console.error("Failed to migrate guest wishlist:", error);
    }
  };

  useEffect(() => {
    if (isUserLoading) return;

    const loadWishlist = async () => {
        setIsLoading(true);
        if (user) {
            await migrateGuestWishlistToDb(user.id);
            const dbWishlist = await fetchDbWishlist(user.id);
            setWishlistItems(dbWishlist);
        } else {
            const guestWishlistJson = localStorage.getItem(GUEST_WISHLIST_KEY);
            setWishlistItems(guestWishlistJson ? JSON.parse(guestWishlistJson) : []);
        }
        setIsLoading(false);
    };

    loadWishlist();
  }, [user, isUserLoading, fetchDbWishlist]);


  const addToWishlist = useCallback(async (product: Product) => {
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isAlreadyInWishlist) return;

    if (user && db) {
        try {
            await db.execute({
                sql: 'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?) ON CONFLICT DO NOTHING',
                args: [user.id, product.id],
            });
            setWishlistItems(prev => [...prev, product]);
        } catch (error) {
            console.error("Failed to add to DB wishlist:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not add item to wishlist." });
            return;
        }
    } else {
      setWishlistItems(prevItems => {
        const newItems = [...prevItems, product];
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
        return newItems;
      });
    }
    toast({
        title: "Ditambahkan ke Wishlist",
        description: `${product.name} telah ditambahkan ke daftar keinginan Anda.`,
    });
  }, [user, toast, wishlistItems]);

  const removeFromWishlist = useCallback(async (productId: number) => {
    const productName = allProducts.find(p => p.id === productId)?.name || 'Item';
    if (user && db) {
        try {
            await db.execute({
                sql: 'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
                args: [user.id, productId],
            });
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
        } catch (error) {
            console.error("Failed to remove from DB wishlist:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not remove item from wishlist." });
            return;
        }
    } else {
        setWishlistItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== productId);
            localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }
    toast({
        variant: "destructive",
        title: "Dihapus dari Wishlist",
        description: `${productName} telah dihapus dari daftar keinginan Anda.`,
    });
  }, [user, toast]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);
  
  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount,
    isLoading
  }), [wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount, isLoading]);

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
