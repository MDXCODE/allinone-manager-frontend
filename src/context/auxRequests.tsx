"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Task {
  task_id: string;
  user_id: string;
  task_name: string;
  task_desc: string;
  task_created_date: string;
  task_due_date: string;
  project_id: string;
  is_completed: boolean;
}

export interface Project {
  project_id: string;
  user_id: string;
  project_name: string;
  project_desc: string;
  project_created_date: string;  
  project_due_date: string;     
  is_completed: boolean;
}

interface AuxRequestsContextType {
  getUserTasks: () => Promise<Task[] | null>;
  getUserProjects: () => Promise<Project[] | null>;
  loadingTasks: boolean;
  loadingProjects: boolean;
  errorTasks: string | null;
  errorProjects: string | null;
}

const AuxRequestsContext = createContext<AuxRequestsContextType | undefined>(undefined);

export const AuxRequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const getUserProjects = useCallback(async (): Promise<Project[] | null> => {
    setLoadingProjects(true);
    setErrorProjects(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/projects/userprojects`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user projects: ${errorText}`);
      }

      const data = await res.json();
      return data.data;
    } catch (e) {
      if (e instanceof Error) {
        setErrorProjects(e.message);
      } else {
        setErrorProjects("An unknown error occurred");
      }
      return null;
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const getUserTasks = useCallback(async (): Promise<Task[] | null> => {
    setLoadingTasks(true);
    setErrorTasks(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks/usertasks`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user tasks: ${errorText}`);
      }

      const data = await res.json();
      return data.data;
    } catch (e) {
      if (e instanceof Error) {
        setErrorTasks(e.message);
      } else {
        setErrorTasks('An unknown error occurred');
      }
      return null;
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  return (
    <AuxRequestsContext.Provider value={{ getUserTasks, getUserProjects, loadingTasks, loadingProjects, errorTasks, errorProjects }}>
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
