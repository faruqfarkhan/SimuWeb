'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { db } from '@/lib/db';
import { config } from 'dotenv';

config();

interface RegisterData {
    name: string;
    email: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string) => Promise<User | null>;
  register: (data: RegisterData) => Promise<User | null>;
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
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string): Promise<User | null> => {
    if (!db) {
        toast({
            variant: "destructive",
            title: "Database Not Configured",
            description: "Cannot log in. Database connection is not set up.",
        });
        return null;
    }

    setIsLoading(true);
    try {
      let userResult = await db.execute({
        sql: 'SELECT id, email, name FROM users WHERE email = ?',
        args: [email],
      });

      if (userResult.rows.length > 0) {
        const currentUser = userResult.rows[0] as unknown as User;
        setUser(currentUser);
        toast({
            title: "Login Berhasil",
            description: `Selamat datang kembali, ${currentUser.name || currentUser.email}!`,
        });
        return currentUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  const register = useCallback(async (data: RegisterData): Promise<User | null> => {
    if (!db) {
        toast({
            variant: "destructive",
            title: "Database Not Configured",
            description: "Cannot register. Database connection is not set up.",
        });
        return null;
    }

    setIsLoading(true);
    try {
      // Step 1: Check if user already exists
      const existingUserResult = await db.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [data.email],
      });

      if (existingUserResult.rows.length > 0) {
        // User already exists, so registration fails.
        return null;
      }

      // Step 2: User does not exist, so insert them.
      await db.execute({
        sql: 'INSERT INTO users (email, name) VALUES (?, ?)',
        args: [data.email, data.name],
      });

      // Step 3: Fetch the newly created user to get their ID and confirm creation.
      const newUserResult = await db.execute({
        sql: 'SELECT id, email, name FROM users WHERE email = ?',
        args: [data.email],
      });

      if (newUserResult.rows.length === 0) {
        // This case is unlikely but indicates an issue with the INSERT or subsequent SELECT.
        throw new Error("Failed to retrieve user after creation.");
      }

      const newUser = newUserResult.rows[0] as unknown as User;
      setUser(newUser);
      
      toast({
          title: "Pendaftaran Berhasil!",
          description: `Selamat datang, ${newUser.name || newUser.email}!`,
      });

      return newUser;
      
    } catch (error) {
      console.error("Registration failed:", error);
      return null; // Return null on any error to trigger the failure message in the form.
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
    // If on a user-only page, redirect to home.
    if (pathname === '/checkout' || pathname === '/wishlist') {
      router.push('/');
    }
  }, [toast, router, pathname]);
  
  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isLoading,
  }), [user, login, register, logout, isLoading]);

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
