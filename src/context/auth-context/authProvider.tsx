"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

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
  signup: (username: string, email: string, password: string) => Promise<void>;
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
        //console.log('User data fetched:', data.data);
        if (!authenticatedOnce) {
          setAuthenticatedOnce(true);
          console.log('User is authorized:', data.data);
        }
      } else {
        const errorText = await res.text();
        setError(`Failed to fetch user details: ${errorText}`);
        if (window.location.pathname !== '/signup') {
         router.push('/');
        }
      }
    } catch (error) {
      setError(`Error fetching user data: ${error}`);
      if (window.location.pathname !== '/signup') {
        router.push('/');
      }
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

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: username, user_email: email, user_pass: password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Signup failed: ${errorText}`);
      } 

    } catch (e) {
      if (e instanceof Error) {
        setError(`Signup error: ${e.message}`);
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

    const initialCheck = async () => {
      console.log('performing initial check')
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/check`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 200) {
          if (window.location.pathname === '/') {
            router.push('/dashboard'); 
          }
        } else if (response.status === 401) {
          console.log('check failed')
          setLoading(false); 
        }
      } catch (error) {
        console.log('error')
        console.error('Error during initial auth check:', error);
        setLoading(false); 
      }
    };

    initialCheck();


    const periodicAuthCheck = async () => {
      try {
        if (window.location.pathname !== '/signup' && window.location.pathname !== '/signupsuccess' ) {
          console.log('this periodicAuthCheck is run');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/check`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.status === 200) {
            await fetchUserData(); 
          } else {
              router.push('/');
          }
        }
      } catch (error) {
          router.push('/');
      }
    };

    periodicAuthCheck();
    const intervalId = setInterval(periodicAuthCheck, 10000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, signup }}>
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
