'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

interface UserContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('simuweb_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      setUser(null);
    }
  }, []);

  const login = useCallback((email: string) => {
    const name = email.split('@')[0];
    const newUser: User = { email, name };
    setUser(newUser);
    localStorage.setItem('simuweb_user', JSON.stringify(newUser));
    toast({
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${name}!`,
    });
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('simuweb_user');
    toast({
        title: "Logout Berhasil",
        description: "Anda telah berhasil keluar.",
    });
    // If on a protected page, redirect to home
    if (pathname === '/checkout') {
      router.push('/');
    }
  }, [toast, router, pathname]);
  
  const value = useMemo(() => ({
    user,
    login,
    logout,
  }), [user, login, logout]);

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
