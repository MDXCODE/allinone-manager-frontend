import React, { useState } from "react";
import "../../../css/forms-css/popup.css";
import { useAuxRequests, Project } from "../../../context/api-context/auxRequests";

interface AddProjectPopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
  projects: Project[];
}

const AddProjectPopupForm: React.FC<AddProjectPopupFormProps> = ({
  isOpen,
  onClose,
  onProjectAdded,
  projects,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { addNewProject } = useAuxRequests();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await addNewProject(projectName, projectDesc, dueDate);

      onProjectAdded();  
      setProjectName("");
      setProjectDesc("");
      setDueDate("");
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-box-background">
        <div className="popup-content">
          <div className="popup-top-content">
            <p className="popup-title">Add New Project</p>
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
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <textarea
                        className="task-desc-input"
                        placeholder="Project Description"
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
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
                  </div>
                </div>
                <button className="submit-task-button" type="submit">Add Project</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPopupForm;
