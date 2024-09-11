import React, { createContext, useContext, useState, useCallback } from "react";

export interface Project {
  project_id: string;
  user_id: string;
  project_name: string;
  project_desc: string;
  project_created_date: string;
  project_due_date: string;
  is_completed: boolean;
}

type ProjectsContextType = {
    getUserProjects: () => Promise<Project[] | null>;
    addNewProject: (projectName: string, projectDesc: string, projectDueDate: string) => Promise<any | null>;
    deleteProject: (projectId: string) => Promise<any | null>;
    loadingProjects: boolean;
    errorProjects: string | null;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);


export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {

    const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
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
          setErrorProjects(e.message);
        } else {
          setErrorProjects('An unknown error occurred');
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
    
        console.log('Project deleted');
  
      } catch (e) {
        if (e instanceof Error) {
          setErrorProjects(e.message);
        } else {
          setErrorProjects('An unknown error occurred');
        }
        return null;
      }
    };

    return (
        <ProjectsContext.Provider
          value={{
            addNewProject, deleteProject, getUserProjects, loadingProjects, errorProjects
          }}
        >
          {children}
        </ProjectsContext.Provider>
      );
};

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (context === undefined) {
      throw new Error("useProjects must be used within ProjectsProvider");
    }
    return context;
  };
  