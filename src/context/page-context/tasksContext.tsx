import React, { createContext, useContext, useState, useCallback } from "react";

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

type TasksContextType = {
  getUserTasks: () => Promise<Task[] | null>;
  addNewTask: (
    taskName: string,
    taskDesc: string,
    taskDueDate: string,
    projectId: string | null
  ) => Promise<any | null>;
  editTask: (
    taskId: string,
    taskName: string,
    taskDesc: string,
    taskDueDate: string,
    projectId: string | null
  ) => Promise<any | null>;
  completeTask: (taskId: string) => Promise<any | null>;
  loadingTasks: boolean;
  errorTasks: string | null;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);

  const getUserTasks = useCallback(async (): Promise<Task[] | null> => {
    setLoadingTasks(true);
    setErrorTasks(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks/usertasks`,
        {
          method: "GET",
          credentials: "include",
        }
      );

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
        setErrorTasks("An unknown error occurred");
      }
      return null;
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const addNewTask = async (
    taskName: string,
    taskDesc: string,
    taskDueDate: string,
    projectId: string | null
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task_name: taskName,
            task_desc: taskDesc,
            task_due_date: taskDueDate,
            project_id: projectId,
          }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add task: ${errorText}`);
      }

      console.log("Added Task");
    } catch (e) {
      if (e instanceof Error) {
        setErrorTasks(e.message);
      } else {
        setErrorTasks("An unknown error occurred");
      }
      return null;
    }
  };

  const editTask = async (
    taskId: string,
    taskName: string,
    taskDesc: string,
    taskDueDate: string,
    projectId: string | null
  ) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks`;
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          task_name: taskName,
          task_desc: taskDesc,
          task_due_date: taskDueDate,
          project_id: projectId,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to update task:", errorText);
        throw new Error(`Failed to update task: ${errorText}`);
      }

      console.log("Task updated successfully");
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error("An unknown error occurred");
      }
      return null;
    }
  };

  const completeTask = async (taskId: string) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/tasks/complete`;
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to complete task:", errorText);
        throw new Error(`Failed to complete task: ${errorText}`);
      }

      console.log("Task copmpleted successfully");
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error("An unknown error occurred");
      }
      return null;
    }
  };

  return (
    <TasksContext.Provider
      value={{
        getUserTasks,
        addNewTask,
        editTask,
        completeTask,
        loadingTasks,
        errorTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within TasksProvider");
  }
  return context;
};
