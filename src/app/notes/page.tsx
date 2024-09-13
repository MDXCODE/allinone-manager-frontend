"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditNotePopupForm from "../../components/forms/notes-page-popups/editNotesPopupForm";
import AddNotePopupForm from "../../components/forms/notes-page-popups/addNotesPopupForm";
import "../../css/pages-css/notes.css";
import { Note, useNotes } from "../../context/page-context/notesContext";

const NotesPage = () => {
  const { push } = useRouter();
  const { getUserNotes, homeSelectedNote, setHomeSelectedNote, handleNoteUpdates, deleteNote, notes, setNotes } = useNotes();
  const searchParams = useSearchParams();
  const [isEditNotePopupOpen, setIsEditNotePopupOpen] = useState(false);
  const [isAddNotePopupOpen, setIsAddNotePopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await getUserNotes();
      if (fetchedNotes) {
        setNotes(fetchedNotes);
      } else {
        setNotes([]);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [getUserNotes, setNotes]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (homeSelectedNote) {
      setIsEditNotePopupOpen(true);
    }
  }, [homeSelectedNote]);

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

  const handleEditNote = (note: Note) => {
    setHomeSelectedNote(note);
    setIsEditNotePopupOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      await fetchNotes(); 
    } catch (e) {
      console.error("Failed to delete note", e);
    }
  };

  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div>Error loading notes: {error}</div>;
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="main-notes-page-container">
        <title>Notes</title>
        <div className="notes-page-titles">
          <h2 className="notes-page-titles-main-title">Notes</h2>
          <h4 className="notes-page-titles-sub-title">The AllInOne User Notes Page</h4>
        </div>
        <div className="notes-page-content">
          <div className="all-notes-container-box">
            <div className="all-notes-container-title">
              <div>
                <h3>All Notes</h3>
              </div>
              <button onClick={() => setIsAddNotePopupOpen(true)} className="add-note-button">
                Add Note
              </button>
            </div>
            <div className="add-notes-top-border"></div>
            <div className="add-notes-top-separator"></div>
            <div className="no-notes-avail">No notes available.</div>
          </div>
        </div>
        <AddNotePopupForm
          isOpen={isAddNotePopupOpen}
          onClose={() => setIsAddNotePopupOpen(false)}
          onNoteAdded={fetchNotes}
        />
      </div>
    );
  }

  return (
    <div className="main-notes-page-container">
      <title>Notes</title>
      <div className="notes-page-titles">
        <h2 className="notes-page-titles-main-title">Notes</h2>
        <h4 className="notes-page-titles-sub-title">The AllInOne User Notes Page</h4>
      </div>
      <div className="notes-page-content">
        <div className="all-notes-container-box">
          <div className="all-notes-container-title">
            <div>
              <h3>All Notes</h3>
            </div>
            <button onClick={() => setIsAddNotePopupOpen(true)} className="add-note-button">
              Add Note
            </button>
          </div>
          <div className="add-notes-top-border"></div>
          <div className="add-notes-top-separator"></div>
          <div className="notes-cards-container">
            {notes.map((note) => (
              <div key={note.note_id} onClick={() => handleEditNote(note)} className="individual-notes-card">
                <div className="individual-note-titles">
                  <p className="notes-individual-title">
                    {note.note_title}{" "}
                    <p className="note-date">{formatDate(note.note_created_date)}</p>
                  </p>
                  <button className="delete-button" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.note_id);
                  }}>
                    Delete
                  </button>
                </div>
                <div className="notes-small-padding"></div>
                <div className="notes-small-separator"></div>
                <div className="notes-small-padding"></div>
                <p className="notes-individual-desc">{truncateText(note.note_content, 321)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddNotePopupForm
        isOpen={isAddNotePopupOpen}
        onClose={() => setIsAddNotePopupOpen(false)}
        onNoteAdded={fetchNotes}
      />

      {homeSelectedNote && (
        <EditNotePopupForm
          isOpen={isEditNotePopupOpen}
          onClose={() => {
            setIsEditNotePopupOpen(false);
            setHomeSelectedNote(null);
          }}
          onNoteUpdated={fetchNotes}
          note={homeSelectedNote}
        />
      )}
    </div>
  );
};

export default NotesPage;
