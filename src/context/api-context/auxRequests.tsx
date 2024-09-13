"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuxRequestsContextType {
  updateUserDetails: (username: string, firstname: string, lastname: string, email: string) => Promise<any | null>;
  errorUser: string | null;
}

const AuxRequestsContext = createContext<AuxRequestsContextType | undefined>(undefined);

export const AuxRequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errorUser, setErrorUser] = useState<string | null>(null);

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
    <AuxRequestsContext.Provider value={{ updateUserDetails, errorUser }}>
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
