"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authProvider";
import Link from "next/link";
import "../../css/pages-css/notes.css";
import { useAuxRequests, Note } from "../../context/auxRequests";
import EditNotePopupForm from "../../components/forms/notes-page-popups/editNotesPopupForm";
import AddNotePopupForm from "../../components/forms/notes-page-popups/addNotesPopupForm";

const NotesPage = () => {
  const { push } = useRouter();
  const { signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getUserNotes, deleteNote, loadingNotes, errorNotes } =
    useAuxRequests();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditNotePopupOpen, setIsEditNotePopupOpen] = useState(false);
  const [isAddNotePopupOpen, setIsAddNotePopupOpen] = useState(false);

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

  const truncateText = (text: string | undefined, limit: number): string => {
    if (!text) {
      return "";
    }
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const fetchUserNotes = async () => {
    const fetchedNotes = await getUserNotes();

    if (fetchedNotes) {
      const notes = fetchedNotes.sort(
        (a, b) =>
          new Date(a.note_created_date).getTime() -
          new Date(b.note_created_date).getTime()
      );

      setNotes(notes);
    }
  };

  const handleNoteAdded = async () => {
    await fetchUserNotes();
  };

  const handleNoteUpdates = async () => {
    await fetchUserNotes();
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditNotePopupOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      await handleNoteUpdates();
    } catch (e) {
      console.error("Failed to delete note", e);
    }
  };

  useEffect(() => {
    fetchUserNotes();
  }, [getUserNotes]);

  if (loadingNotes) {
    return <div>Loading notes...</div>;
  }

  if (errorNotes) {
    return <div>Error loading notes: {errorNotes}</div>;
  }

  return (
    <div className="main-notes-page-container">
      <div className="notes-page-titles">
        <h2 className="notes-page-titles-main-title">Notes</h2>
        <h4 className="notes-page-titles-sub-title">
          The AllInOne User Notes Page
        </h4>
      </div>
      <div className="notes-page-content">
        <div className="all-notes-container-box">
          <div className="all-notes-container-title">
            <div>
              <h3>All Notes</h3>
            </div>
            <button
              onClick={() => setIsAddNotePopupOpen(true)}
              className="add-note-button"
            >
              Add Note
            </button>
          </div>
          <div className="add-notes-top-border"></div>
          <div className="add-notes-top-separator"></div>
          <div className="notes-cards-container">
            {notes.map((note) => (
              <div
                key={note.note_id}
                onClick={() => handleEditNote(note)}
                className="individual-notes-card"
              >
                <div className="individual-note-titles">
                  <p className="notes-individual-title">
                    {note.note_title}{" "}
                    <p className="note-date">
                      {formatDate(note.note_created_date)}
                    </p>
                  </p>

                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.note_id);
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div className="notes-small-padding"></div>
                <div className="notes-small-separator"></div>
                <div className="notes-small-padding"></div>
                <p className="notes-individual-desc">
                  {truncateText(note.note_content, 321)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddNotePopupForm
        isOpen={isAddNotePopupOpen}
        onClose={() => setIsAddNotePopupOpen(false)}
        onNoteAdded={handleNoteAdded}
      />

      {selectedNote && (
        <EditNotePopupForm
          isOpen={isEditNotePopupOpen}
          onClose={() => {
            setIsEditNotePopupOpen(false);
            setSelectedNote(null);
          }}
          onNoteUpdated={handleNoteUpdates}
          note={selectedNote}
        />
      )}
    </div>
  );
};

export default NotesPage;
