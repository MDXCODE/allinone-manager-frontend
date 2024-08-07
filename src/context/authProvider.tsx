// src/context/authProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  user_name: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticatedOnce, setAuthenticatedOnce] = useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/users/details`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
        if (!authenticatedOnce) {
          setAuthenticatedOnce(true);
        }
      } else {
        const errorText = await res.text();
        setError(`Failed to fetch user details: ${errorText}`);
        router.push('/');
      }
    } catch (error) {
      setError(`Error fetching user data: ${error}`);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: username, user_pass: password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      await fetchUserData();
    } catch (error) {
      if (error instanceof Error) {
        setError(`Login error: ${error.message}`);
        throw error; 
      }
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/logout`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }

      setUser(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Logout error: ${e.message}`);
      } else {
        setError('Unknown error during logout');
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/check`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 200) {
          await fetchUserData(); 
        } else {
          router.push('/');
        }
      } catch (error) {
        router.push('/');
      }
    };

    checkAuth();
    const intervalId = setInterval(checkAuth, 10000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
