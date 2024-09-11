import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {  useAuxRequests } from '../api-context/auxRequests';

export interface Note {
  note_id: string;
  user_id: string;
  note_title: string;
  note_content: string;
  note_created_date: string;
}

type NotesContextType = {
  homeSelectedNote: Note | null;
  setHomeSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  notes: Note[];
  fetchUserNotes: () => Promise<void>;
  handleNoteUpdates: () => Promise<void>;
  deleteNote: (noteId: string) => Promise<any | null>;
  addNewNote: (noteTitle: string, noteContent: string) => Promise<any | null>;
  editNote: (noteId: string, noteTitle: string, noteContent: string) => Promise<any | null>;
  getUserNotes: () => Promise<Note[] | null>;
  errorNotes: string | null;
  loadingNotes: boolean;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [homeSelectedNote, setHomeSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(false);
  const [errorNotes, setErrorNotes] = useState<string | null>(null);

  const fetchUserNotes = async () => {
    const fetchedNotes = await getUserNotes();
    if (fetchedNotes) {
      const sortedNotes = fetchedNotes.sort(
        (a, b) => new Date(a.note_created_date).getTime() - new Date(b.note_created_date).getTime()
      );
      setNotes(sortedNotes);
    }
  };

  const handleNoteUpdates = async () => {
    await fetchUserNotes();
  };

  const getUserNotes = useCallback(async (): Promise<Note[] | null> => {
    setLoadingNotes(true);
    setErrorNotes(null);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/notes/usernotes`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user notes: ${errorText}`);
      }

      const data = await res.json();
      return data.data;

    } catch (e) {
      if (e instanceof Error) {
        setErrorNotes(e.message);
      } else {
        setErrorNotes("An unknown error occurred");
      }
      return null;
    } finally {
      setLoadingNotes(false);
    }

  }, []);

  const addNewNote = async (noteTitle: string, noteContent: string) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/notes`;
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_title: noteTitle, note_content: noteContent }),
        credentials: 'include',
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to add note:', errorText);
        throw new Error(`Failed to add note: ${errorText}`);
      }
    
      console.log('Note added successfully');
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error('An unknown error occurred');
      }
      return null;
    }
  
  };


  const editNote = async (noteId: string, noteTitle: string, noteContent: string) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/notes`;
    try {
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: noteId, note_title: noteTitle, note_content: noteContent}),
        credentials: 'include',
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to update note:', errorText);
        throw new Error(`Failed to update note: ${errorText}`);
      }
    
      console.log('Note updated successfully');
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error('An unknown error occurred');
      }
      return null;
    }
  
  };

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/notes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: noteId}),
        credentials: 'include',
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete note: ${errorText}`);
      }
  
      console.log('Note deleted');

    } catch (e) {
      return null;
    }

  }

  useEffect(() => {
    fetchUserNotes();
  }, [getUserNotes]);

  return (
    <NotesContext.Provider value={{ homeSelectedNote, setHomeSelectedNote, notes, fetchUserNotes, handleNoteUpdates, deleteNote, getUserNotes, addNewNote, editNote, loadingNotes, errorNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
