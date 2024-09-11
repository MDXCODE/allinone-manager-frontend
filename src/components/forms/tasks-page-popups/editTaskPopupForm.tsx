import React, { useState, useEffect } from "react";
import "../../../css/forms-css/popup.css";
import { Project, useProjects } from "../../../context/page-context/projectContext";
import { Task, useTasks } from "../../../context/page-context/tasksContext";

interface EditTaskPopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: Task;
  projects: Project[];
}

const EditTaskPopupForm: React.FC<EditTaskPopupFormProps> = ({
  isOpen,
  onClose,
  onTaskUpdated,
  task,
  projects,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const { editTask } = useTasks();

  const [taskName, setTaskName] = useState(task.task_name);
  const [taskDesc, setTaskDesc] = useState(task.task_desc);
  const [dueDate, setDueDate] = useState(formatDate(task.task_due_date));
  const [projectId, setProjectId] = useState<string | null>(task.project_id);

  useEffect(() => {
    setTaskName(task.task_name);
    setTaskDesc(task.task_desc);
    setDueDate(formatDate(task.task_due_date));
    setProjectId(task.project_id);
  }, [task]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (task && task.task_id) {
      try {
        await editTask(task.task_id, taskName, taskDesc, dueDate, projectId);

        onTaskUpdated();
        setTaskName("");
        setTaskDesc("");
        setDueDate("");
        setProjectId("");
        onClose();
      } catch (error) {
        console.error("Error editing task:", error);
        alert("Failed to edit task. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-box-background">
        <div className="popup-content">
          <div className="popup-top-content">
            <p className="popup-title">Edit Task</p>
            <button className="popup-close-button" onClick={onClose}>
              X
            </button>
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
                        onChange={(e) =>
                          setProjectId(
                            e.target.value === "" ? null : e.target.value
                          )
                        }
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option
                            key={project.project_id}
                            value={project.project_id}
                          >
                            {project.project_name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                <button className="submit-task-button" type="submit">
                  Update Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPopupForm;
