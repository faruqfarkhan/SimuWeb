'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { db } from '@/lib/db';

interface UserContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // This effect now only handles initialization state, not user loading.
    // User loading happens on login.
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string) => {
    if (!db) {
        toast({
            variant: "destructive",
            title: "Database Not Configured",
            description: "Cannot log in. Database connection is not set up.",
        });
        return;
    }

    setIsLoading(true);
    try {
      // Check if user exists
      let userResult = await db.execute({
        sql: 'SELECT id, email, name FROM users WHERE email = ?',
        args: [email],
      });

      let currentUser: User;

      if (userResult.rows.length > 0) {
        // User exists
        currentUser = userResult.rows[0] as unknown as User;
      } else {
        // User does not exist, create them
        const name = email.split('@')[0];
        const insertResult = await db.execute({
          sql: 'INSERT INTO users (email, name) VALUES (?, ?) RETURNING id, email, name',
          args: [email, name],
        });
        if (insertResult.rows.length === 0){
            throw new Error("Failed to create user account.");
        }
        currentUser = insertResult.rows[0] as unknown as User;
      }
      
      setUser(currentUser);
      
      toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali, ${currentUser.name || currentUser.email}!`,
      });
      
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Terjadi kesalahan saat mencoba masuk.",
      });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    toast({
        title: "Logout Berhasil",
        description: "Anda telah berhasil keluar.",
    });
    if (pathname === '/checkout' || pathname === '/wishlist') {
      router.push('/');
    }
  }, [toast, router, pathname]);
  
  const value = useMemo(() => ({
    user,
    login,
    logout,
    isLoading,
  }), [user, login, logout, isLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
