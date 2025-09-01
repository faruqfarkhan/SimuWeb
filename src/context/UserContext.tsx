'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { db } from '@/lib/db';

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
    // This effect is just to remove the initial loading state.
    // In a real app with sessions, you'd verify the session here.
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
      const userResult = await db.execute({
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
        return null; // User not found
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
      // 1. Check if user already exists
      const existingUserResult = await db.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [data.email],
      });

      if (existingUserResult.rows.length > 0) {
        return null; // Indicates user already exists
      }

      // 2. Create the new user
      await db.execute({
        sql: 'INSERT INTO users (email, name) VALUES (?, ?)',
        args: [data.email, data.name],
      });

      // 3. Retrieve the newly created user to get their ID
      const newUserResult = await db.execute({
        sql: 'SELECT id, email, name FROM users WHERE email = ?',
        args: [data.email],
      });
      
      if (newUserResult.rows.length === 0) {
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
      return null;
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
    // If the user is on a protected page, redirect them.
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
