import React, { useState, useEffect } from "react";
import "../../../css/forms-css/popup.css";
import { useAuxRequests, Note } from "../../../context/auxRequests";

interface AddNotePopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: () => void;
}

const AddNotePopupForm: React.FC<AddNotePopupFormProps> = ({
  isOpen,
  onClose,
  onNoteAdded,
}) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const { addNewNote } = useAuxRequests();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await addNewNote(noteTitle, noteContent);

      onNoteAdded();
      setNoteTitle("");
      setNoteContent("");
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-box-background">
        <div className="popup-content">
          <div className="popup-top-content">
            <p className="popup-title">Edit Note</p>
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
                        placeholder="Note Title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <textarea
                        className="task-desc-input"
                        placeholder="Note Content"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </div>
                <button className="submit-task-button" type="submit">Add Note</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNotePopupForm;
