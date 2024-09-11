import React, { useState, useEffect } from "react";
import "../../../css/forms-css/popup.css";
import { useAuxRequests} from "../../../context/api-context/auxRequests";
import { useNotes, Note } from "../../../context/page-context/notesContext";

interface EditNotePopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteUpdated: () => void;
  note: Note;
}

const EditNotePopupForm: React.FC<EditNotePopupFormProps> = ({
  isOpen,
  onClose,
  onNoteUpdated,
  note,
}) => {
  const [noteTitle, setNoteTitle] = useState(note.note_title);
  const [noteContent, setNoteContent] = useState(note.note_content);

  const { editNote } = useNotes();

  useEffect(() => {
    if (note.note_title === "No Title") {
        setNoteTitle("");
    } else {
        setNoteTitle(note.note_title);
    }

    if (note.note_content === "No Content") {
        setNoteContent("");
    } else {
        setNoteContent(note.note_content);
    }
  }, [note]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (note && note.note_id) {
        try {
            await editNote(note.note_id, noteTitle, noteContent);

            onNoteUpdated();
            setNoteTitle("");
            setNoteContent("");
            onClose();
        } catch (error) {
          console.error("Error adding note:", error);
          alert("Failed to add note. Please try again.");
        }
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
                <button className="submit-task-button" type="submit">Edit Note</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNotePopupForm;
