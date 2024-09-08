"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authProvider';
import { useAuxRequests, Task, Project } from '../../context/auxRequests';
import "../../css/pages-css/dashboard.css";

const Dashboard = () => {
  const { user, loading: authLoading, error: authError, logout } = useAuth();

  const { getUserTasks} = useAuxRequests();
  const [tasks, setTasks] = useState<Task[]>([]);

  const {getUserProjects} = useAuxRequests();
  const [projects, setProjects] = useState<Project[]>([]);

  //const {getUserNotes} = useAuxRequests();
  //const [notes, setNotes] = useState<Project[]>([]);

  const router = useRouter();
  const reloadCount = Number(sessionStorage.getItem('reloadCount')) || 0;

  useEffect(() => {
    if (reloadCount < 2) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const tasks = await getUserTasks(); 
        if (tasks) {
          setTasks(tasks);
        }
      }
    };

    fetchTasks();
  }, [user, getUserTasks]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const projects = await getUserProjects(); 
        if (projects) {
          setProjects(projects);
        }
      }
    };

    fetchProjects();
  }, [user, getUserProjects]);

  if (authLoading) return <div>Loading...</div>;
  if (authError) return <div>{authError}</div>;
  if (!user) return <div>Not authenticated</div>;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="main-dashboard-container">
      <title>Dashboard Page</title>
      <div className="dashboard-title">
        <h1>Dashboard</h1>
        <h4>The AllInOne User Dashboard</h4>
      </div>
      <ul>
        <li>
          <strong>Username:</strong> {user.user_name}
        </li>
        <li>
          <strong>Email:</strong> {user.user_email}
        </li>
        <li>
          <strong>First Name:</strong> {user.user_first_name}
        </li>
        <li>
          <strong>Last Name:</strong> {user.user_last_name}
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 text-white w-fit rounded"
      >
        Logout
      </button>

      <div className="projects-section">
        <h2>User Projects</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.project_id}>
                <strong>{project.project_name}</strong> - {project.project_desc}
                <br />
                <small>
                  Created on:{" "}
                  {new Date(project.project_created_date).toLocaleDateString()}
                </small>
                <br />
                <small>
                  Due by:{" "}
                  {new Date(project.project_due_date).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tasks-section">
        <h2>User Tasks</h2>
        { tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task) => {
              const associatedProject = projects.find(
                (project) => project.project_id === task.project_id
              );

              return (
                <li key={task.task_id}>
                  <strong>{task.task_name}</strong> - {task.task_desc}
                  <br />
                  <small>
                    Created on:{" "}
                    {new Date(task.task_created_date).toLocaleDateString()}
                  </small>
                  <br />
                  <small>
                    Due by: {new Date(task.task_due_date).toLocaleDateString()}
                  </small>
                  <br />
                  <small>
                    Associated With Project:{" "}
                    {associatedProject
                      ? associatedProject.project_name
                      : "No associated project"}
                  </small>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
