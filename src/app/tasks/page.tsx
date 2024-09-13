"use client";

import React, { useEffect, useState } from "react";
import "../../css/pages-css/tasks.css";
import { Task, useTasks } from "../../context/page-context/tasksContext";
import {
  Project,
  useProjects,
} from "../../context/page-context/projectContext";
import Image from "next/image";
import TaskFormPopup from "../../components/forms/tasks-page-popups/addTaskPopupForm";
import EditTaskPopupForm from "../../components/forms/tasks-page-popups/editTaskPopupForm";
import AddProjectPopupForm from "../../components/forms/tasks-page-popups/addProjectPopupForm";
import ManageProjectPopupForm from "../../components/forms/tasks-page-popups/manageProjectsForm";
import eclipseIcon from "../../images/tasks-images/eclipse.svg";

const isTaskDueTodayOrLater = (taskDueDate: string) => {
  const today = new Date();
  const dueDate = new Date(taskDueDate);

  return (
    dueDate.getFullYear() > today.getFullYear() ||
    (dueDate.getFullYear() === today.getFullYear() &&
      (dueDate.getMonth() > today.getMonth() ||
        (dueDate.getMonth() === today.getMonth() &&
          dueDate.getDate() >= today.getDate())))
  );
};

const TasksPage = () => {
  const {
    homeSelectedTask,
    setHomeSelectedTask,
    getUserTasks,
    completeTask,
    loadingTasks,
    errorTasks,
  } = useTasks();
  const { getUserProjects } = useProjects();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMap, setProjectMap] = useState<Map<string, string>>(new Map());
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddProjectPopupOpen, setIsAddProjectPopupOpen] = useState(false);
  const [isEditProjectPopupOpen, setIsEditProjectPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const getSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const suffix = getSuffix(day);
    return `${month} ${day}${suffix}, ${year}`;
  };

  const fetchAndCategorizeTasks = async () => {
    try {
      const fetchedTasks = await getUserTasks();
      const fetchedProjects = await getUserProjects();
      if (fetchedTasks) {
        if (fetchedProjects) {
          const projectMap = new Map(
            fetchedProjects.map((project) => [
              project.project_id,
              project.project_name,
            ])
          );
          setProjectMap(projectMap);
        }

        const sortedTasks = fetchedTasks.sort(
          (a, b) =>
            new Date(a.task_due_date).getTime() -
            new Date(b.task_due_date).getTime()
        );

        const nonOverdueTasks = sortedTasks.filter((task) =>
          isTaskDueTodayOrLater(task.task_due_date)
        );
        const overdue = sortedTasks.filter(
          (task) => !isTaskDueTodayOrLater(task.task_due_date)
        );

        setTasks(nonOverdueTasks);
        setOverdueTasks(overdue);
      } else {
        setTasks([]);
        setOverdueTasks([]);
      }
    } catch (error) {
      console.error("Error fetching or processing tasks:", error);
      setTasks([]);
      setOverdueTasks([]);
    }
  };

  const refreshProjects = async () => {
    try {
      const fetchedProjects = await getUserProjects();

      if (fetchedProjects) {
        const sortedProjects =
          fetchedProjects.length > 0
            ? fetchedProjects.sort((a, b) =>
                a.project_name.localeCompare(b.project_name)
              )
            : [];

        setProjects(sortedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchAndCategorizeTasks();
  }, [getUserTasks, getUserProjects]);

  useEffect(() => {
    refreshProjects();
  }, [getUserProjects]);

  useEffect(() => {
    if (homeSelectedTask) {
      setIsEditPopupOpen(true);
    }
  }, [homeSelectedTask]);

  const handleTaskAdded = async () => {
    await fetchAndCategorizeTasks();
  };

  const handleTaskUpdated = async () => {
    await fetchAndCategorizeTasks();
  };

  const handleEditTask = (task: Task) => {
    setHomeSelectedTask(task);
    setIsEditPopupOpen(true);
  };

  const handleProjectEdited = async () => {
    await refreshProjects();
  };

  const truncateText = (text: string, limit: number): string => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      await handleTaskUpdated();
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleProjectFilter = (projectId: string | null) => {
    setSelectedProject(projectId);
  };

  const filteredTasks = selectedProject
    ? tasks.filter((task) => task.project_id === selectedProject)
    : tasks;

  const filteredOverdueTasks = selectedProject
    ? overdueTasks.filter((task) => task.project_id === selectedProject)
    : overdueTasks;

  if (loadingTasks) {
    return <div>Loading tasks...</div>;
  }


  return (
    <div className="main-tasks-page-container">
      <title>Tasks</title>
      <div className="tasks-page-titles">
        <h2 className="tasks-page-titles-main-title">Tasks</h2>
        <h4 className="tasks-page-titles-sub-title">
          The AllInOne User Tasks Page
        </h4>
      </div>

      <div className="tasks-page">
        <div className="all-tasks-container">
          <div className="all-tasks-container-content">
            <div className="all-tasks-container-title">
              <div>
                <h3>All Tasks (Sorted by Date)</h3>
              </div>
              <button
                onClick={() => setIsAddPopupOpen(true)}
                className="add-task-button"
              >
                Add Task
              </button>
            </div>

            <div className="add-tasks-top-border"></div>
            <div className="add-tasks-top-separator"></div>

            <div className="all-tasks-container-tasks">
              {filteredTasks.length === 0 ? ( 
                 <p>No tasks available.</p>
              ) : (
               filteredTasks.map((task) => (
                <div
                  key={task.task_id}
                  onClick={() => handleEditTask(task)}
                  className="task-item"
                >
                  <Image
                    src={eclipseIcon}
                    alt="Tasks Icon"
                    className="is-completed-button"
                    width={40}
                    height={40}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.task_id);
                    }}
                  />
                  <div className="overall-task-formatting">
                    <div className="individual-task-formatting">
                      <h4>{task.task_name}</h4>
                      <p className="task-desc">
                        {truncateText(task.task_desc, 55)}
                      </p>
                    </div>
                    <div className="individual-project-formatting">
                      <p className="task-project-name">
                        {projectMap.get(task.project_id) || "No Project"}
                        <br />
                        <p className="task-due-date-formatting">
                          {formatDate(task.task_due_date)}
                        </p>
                      </p>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>

        <div className="tasks-side-container">
          <div className="sortbyproject-tasks-container">
            <div className="sortbyproject-title">
              <h3 className="">Project Filter</h3>
              <div className="sortbyprojects-buttons-div">
                <button
                  onClick={() => setIsEditProjectPopupOpen(true)}
                  className="manage-project-button"
                >
                  ⋯
                </button>
                <button
                  onClick={() => setIsAddProjectPopupOpen(true)}
                  className="add-project-button"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="add-tasks-top-border"></div>
            <div className="add-tasks-top-separator"></div>
            <div className="project-sort-buttons-container">
              <button
                onClick={() => handleProjectFilter(null)}
                className={`all-tasks-button ${
                  selectedProject === null ? "selected" : ""
                }`}
              >
                All Tasks
              </button>
              {projects.map((project) => (
                <div key={project.project_id}>
                  <button
                    className={`project-sort-buttons ${
                      selectedProject === project.project_id ? "selected" : ""
                    }`}
                    onClick={() => handleProjectFilter(project.project_id)}
                  >
                    {project.project_name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="overdue-tasks-container">
            <div className="overdue-tasks-container-title">
              <h3>Overdue Tasks</h3>
            </div>
            <div className="add-tasks-top-border"></div>
            <div className="add-tasks-top-separator"></div>
            <div className="overdue-tasks-container-tasks">
              {filteredOverdueTasks.map((task) => (
                <div
                  key={task.task_id}
                  className="task-item"
                  onClick={() => handleEditTask(task)}
                >
                  <Image
                    src={eclipseIcon}
                    alt="Tasks Icon"
                    className="is-completed-button"
                    width={40}
                    height={40}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.task_id);
                    }}
                  />
                  <p>{task.task_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TaskFormPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        onTaskAdded={handleTaskAdded}
        projects={projects}
      />

      {homeSelectedTask && (
        <EditTaskPopupForm
          isOpen={isEditPopupOpen}
          onClose={() => {
            setIsEditPopupOpen(false);
            setHomeSelectedTask(null);
          }}
          onTaskUpdated={handleTaskUpdated}
          task={homeSelectedTask}
          projects={projects}
        />
      )}

      <AddProjectPopupForm
        isOpen={isAddProjectPopupOpen}
        onClose={() => {
          setIsAddProjectPopupOpen(false);
          refreshProjects();
        }}
        onProjectAdded={refreshProjects}
        projects={projects}
      />

      <ManageProjectPopupForm
        isOpen={isEditProjectPopupOpen}
        onClose={() => {
          setIsEditProjectPopupOpen(false);
          refreshProjects();
        }}
        onProjectEdited={handleProjectEdited}
        projects={projects}
      />
    </div>
  );
};

export default TasksPage;
