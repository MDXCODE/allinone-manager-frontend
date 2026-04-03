"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  user_name: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
}

interface AuxRequestsContextType {
  updateUserDetails: (username: string, firstname: string, lastname: string, email: string) => Promise<any | null>;
  fetchUserData: () => Promise<User | null>;
  errorUser: string | null;
  userDetails: User | null;
}

const AuxRequestsContext = createContext<AuxRequestsContextType | undefined>(undefined);

export const AuxRequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<User | null> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/users/details`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (res.ok) {
        const data = await res.json();
        setUserDetails(data.data);
        return data.data; 
      } else {
        const errorText = await res.text();
        setUserDetailsError(`Failed to fetch user details: ${errorText}`);
        return null;
      }
    } catch (error) {
      setUserDetailsError(`Error fetching user data: ${error}`);
      return null; 
    }
  };

  const updateUserDetails = async (username: string, firstname: string, lastname: string, email: string) => {
     try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: username, user_first_name: firstname, user_last_name: lastname, user_email: email}),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update user details: ${errorText}`);
      }

      const data = await res.json();
      return data.data;

     } catch (e) {

      if (e instanceof Error) {
        setErrorUser(e.message);
      } else {
        setErrorUser('An unknown error occurred');
      }
      return null;

     }
  };

  return (
    <AuxRequestsContext.Provider value={{ userDetails, fetchUserData, updateUserDetails, errorUser }}>
      {children}
    </AuxRequestsContext.Provider>
  );
};

export const useAuxRequests = () => {
  const context = useContext(AuxRequestsContext);
  if (context === undefined) {
    throw new Error('useAuxRequests must be used within an AuxRequestsProvider');
  }
  return context;
};
