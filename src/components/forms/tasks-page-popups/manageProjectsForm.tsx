import React from "react";
import "../../../css/forms-css/popup.css";
import { Project, useProjects } from "../../../context/page-context/projectContext";

interface ManageProjectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectEdited: () => void;
}

const ManageProjectPopupForm: React.FC<ManageProjectPopupProps> = ({
  isOpen,
  onClose,
  projects,
  onProjectEdited,
}) => {
  const { deleteProject } = useProjects();

  if (!isOpen) return null;

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      await onProjectEdited();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-box-background">
        <div className="popup-content">
          <div className="popup-top-content">
            <p className="popup-title">Manage Projects</p>
            <button className="popup-close-button" onClick={onClose}>
              X
            </button>
          </div>
          <div className="popup-top-border"></div>
          <div className="popup-top-separator"></div>
          <div className="popup-lower-content">
            <div className="popup-form">
              <div className="project-list">
                {projects.length === 0 ? (
                  <p>No projects available.</p>
                ) : (
                  projects.map((project) => (
                    <div key={project.project_id} className="project-item">
                      <div className="project-info">
                        <h4>{project.project_name}</h4>
                        <p>{project.project_desc}</p>
                      </div>
                      <button
                        className="delete-project-button"
                        onClick={() => handleDelete(project.project_id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjectPopupForm;
