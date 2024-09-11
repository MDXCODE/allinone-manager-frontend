"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {useNotes, Note} from "../../context/page-context/notesContext";
import { useAuth } from "../../context/auth-context/authProvider";
import { useAuxRequests, Task, Project } from "../../context/api-context/auxRequests";
import "../../css/pages-css/dashboard.css";
import notesIcon from "../../images/dashboard-images/transparentNotesIcon.svg";

const Dashboard = () => {
  const { user, loading: authLoading, error: authError, logout } = useAuth();

  const { getUserTasks } = useAuxRequests();
  const [tasks, setTasks] = useState<Task[]>([]);

  const { getUserProjects } = useAuxRequests();
  const [projects, setProjects] = useState<Project[]>([]);

  const { getUserNotes } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);

  const router = useRouter();
  const reloadCount = Number(sessionStorage.getItem("reloadCount")) || 0;

  const { setHomeSelectedNote } = useNotes();

  const handleNoteClick = async (noteId: string) => {
    const note = notes.find((n) => n.note_id === noteId);
    if (note) {
      setHomeSelectedNote(note); 
      router.push("/notes");
    }
  };

  useEffect(() => {
    if (reloadCount < 2) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const tasks = await getUserTasks();
        if (tasks) {
          const firstSixTasks = tasks.slice(0, 6);
          setTasks(firstSixTasks);
        }
      }
    };

    fetchTasks();
  }, [user, getUserTasks]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const projects = await getUserProjects();
        if (projects) {
          const firstThreeProjects = projects.slice(0, 3);
          setProjects(firstThreeProjects);
        }
      }
    };

    fetchProjects();
  }, [user, getUserProjects]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (user) {
        const notes = await getUserNotes();
        if (notes) {
          const firstThreeNotes = notes.slice(0, 3);
          setNotes(firstThreeNotes);
        }
      }
    };
    fetchNotes();
  }, [user, getUserNotes]);

  const notesRedirect = async () => {
    router.push("/notes");
  };

  if (authLoading) return <div>Loading...</div>;
  if (authError) return <div>{authError}</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="main-dashboard-page-container">
      <div className="dashboard-page-titles">
        <h2 className="dashboard-page-titles-main-title">Dashboard</h2>
        <h4 className="dashboard-page-titles-sub-title">
          The AllInOne User Notes Page
        </h4>
      </div>

      <div className="dashboard-elements-full-container">
        <div className="dashboard-elements-full-container-layer-one">
          <div className="dashboard-intro-paragraph-container">
            <h2 className="dashboard-intro-paragraph-title">
              Hello {user.user_name}!
            </h2>
            <p className="dashboard-intro-paragraph-content">
              To whomever it may concern, please read this descriptor. While the
              overall premise of the application is a simple one, with it being
              a todo app and all, I created this web application with the intent
              of refreshing upon my current skills, as well as adding entirely
              new skills to my skillset. It is my first full-stack web
              application made without the instructions of a school assignment,
              or without the help of a team of fellow students. The front end
              was built using the Next.js React Framework, while the back-end
              API was built using Express.js, with my database being held with
              PostgreSQL. I also took the liberty of implementing custom basic
              authentication, which utilizes JWT Tokens to track user
              authentication. The design mockup was created entirely in Figma.
              This web application allows users to stay on top of their
              productivity, through the logging of projects, tasks, reminders or
              simple notes that they wish not to forget.
            </p>
          </div>

          <div className="current-notes-container">
            <div className="current-notes-container-header">
              <p>Current Notes</p>
              <p className="view-all-text" onClick={notesRedirect}>
                View All →
              </p>
            </div>
            <div className="current-notes-inner-container">
              {notes.map((note) => (
                <div key={note.note_id} 
                className="note-card"
                onClick={() => handleNoteClick(note.note_id)}
                >
                  <Image
                    src={notesIcon}
                    alt="Notes Icon"
                    width={30}
                    height={30}
                  />
                  <p className="note-card-text">{note.note_title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
