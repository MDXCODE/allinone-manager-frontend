import React, { useState } from "react";
import "../../../css/forms-css/popup.css";
import { Project, useProjects } from "../../../context/page-context/projectContext";
import { Task, useTasks } from "../../../context/page-context/tasksContext";

interface TaskFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;  
  projects: Project[];
}

const TaskFormPopup: React.FC<TaskFormPopupProps> = ({ isOpen, onClose, onTaskAdded, projects }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const { addNewTask } = useTasks();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await addNewTask(taskName, taskDesc, dueDate, projectId);

      onTaskAdded();
      setTaskName("");
      setTaskDesc("");
      setDueDate("");
      setProjectId(null);
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-box-background">
        <div className="popup-content">
          <div className="popup-top-content">
            <p className="popup-title">Add New Task</p>
            <button className="popup-close-button" onClick={onClose}>X</button>
          </div>
          <div className="popup-top-border"></div>
          <div className="popup-top-separator"></div>
          <div className="popup-lower-content">
            <div className="popup-form">
              <form onSubmit={handleSubmit}>
                <div className="popup-flex-box">
                  <div className="popup-left-flex">
                    <label>
                      <input
                        type="text"
                        className="task-name-input"
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <textarea
                        className="task-desc-input"
                        placeholder="Task Description"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="popup-right-flex">
                    <label className="task-date-label">
                      Due Date:
                      <input
                        type="date"
                        className="task-date-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </label>
                    <div className="right-padding"></div>
                    <label className="task-project-label">
                      Project:
                      <select
                        className="task-project-input"
                        value={projectId || ""}
                        onChange={(e) => setProjectId(e.target.value)}
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option key={project.project_id} value={project.project_id}>
                            {project.project_name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                <button className="submit-task-button" type="submit">Add Task</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFormPopup;
