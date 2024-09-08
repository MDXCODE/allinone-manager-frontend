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
  addNewProject: (projectName: string, projectDesc: string, projectDueDate: string) => Promise<any | null>;
  deleteProject: (projectId: string) => Promise<any | null>;
  updateUserDetails: (username: string, firstname: string, lastname: string, email: string) => Promise<any | null>;
  addNewTask: (taskName: string, taskDesc: string, taskDueDate: string, projectId: string | null) => Promise<any | null>;
  editTask: (taskId: string, taskName: string, taskDesc: string, taskDueDate: string, projectId: string | null) => Promise<any | null>;
  completeTask: (taskId: string) => Promise<any | null>;
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

  const addNewProject = async (projectName: string, projectDesc: string, projectDueDate: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_name: projectName, project_desc: projectDesc, project_due_date: projectDueDate }),
        credentials: 'include',
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add project: ${errorText}`);
      }
  
      console.log('Added Project');
      console.log(res.json());
  
    } catch (e) {
      if (e instanceof Error) {
        setErrorTasks(e.message);
      } else {
        setErrorTasks('An unknown error occurred');
      }
      console.error('Error in addNewProject:', e); 
    }
  };
  

  const deleteProject = async (projectId: string) => {
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/projects`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId}),
        credentials: 'include',
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete project: ${errorText}`);
      }
  
      console.log('Task deleted');

    } catch (e) {
      if (e instanceof Error) {
        setErrorTasks(e.message);
      } else {
        setErrorTasks('An unknown error occurred');
      }
      return null;
    }
  };

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

  const addNewTask = async (taskName: string, taskDesc: string, taskDueDate: string, projectId: string | null) => {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_name: taskName, task_desc: taskDesc, task_due_date: taskDueDate, project_id: projectId}),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add task: ${errorText}`);
      }

      console.log('Added Task')

    } catch (e) {

      if (e instanceof Error) {
        setErrorTasks(e.message);
      } else {
        setErrorTasks('An unknown error occurred');
      }
      return null;

    }

  };

  const editTask = async (taskId: string, taskName: string, taskDesc: string, taskDueDate: string, projectId: string | null) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks`;
    try {
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, task_name: taskName, task_desc: taskDesc, task_due_date: taskDueDate, project_id: projectId }),
        credentials: 'include',
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to update task:', errorText);
        throw new Error(`Failed to update task: ${errorText}`);
      }
    
      console.log('Task updated successfully');
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error('An unknown error occurred');
      }
      return null;
    }
  };

  const completeTask = async (taskId: string) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks/complete`;
    try {
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId}),
        credentials: 'include',
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to complete task:', errorText);
        throw new Error(`Failed to complete task: ${errorText}`);
      }
    
      console.log('Task copmpleted successfully');
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error('An unknown error occurred');
      }
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
        setErrorTasks(e.message);
      } else {
        setErrorTasks('An unknown error occurred');
      }
      return null;

     }
  };

  return (
    <AuxRequestsContext.Provider value={{ getUserTasks, addNewProject, deleteProject, getUserProjects, addNewTask, editTask, completeTask, updateUserDetails, loadingTasks, loadingProjects, errorTasks, errorProjects }}>
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
