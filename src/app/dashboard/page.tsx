"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNotes, Note } from "../../context/page-context/notesContext"; 
import { useReminders, Reminder } from "../../context/page-context/remindersContext";
import { useAuth } from "../../context/auth-context/authProvider";
import { useAuxRequests } from "../../context/api-context/auxRequests";
import {
  Task,
  CompletedTask,
  useTasks,
} from "../../context/page-context/tasksContext";
import {
  Project,
  useProjects,
} from "../../context/page-context/projectContext";
import "../../css/pages-css/dashboard.css";
import notesIcon from "../../images/dashboard-images/transparentNotesIcon.svg";
import tasksIcon from "../../images/dashboard-images/transparentTasksIcon.svg";
import remindersIcon from "../../images/dashboard-images/transparentRemindersIcon.svg";

const Dashboard = () => {
  const { user, loading: authLoading, error: authError, logout } = useAuth();

  const { getUserTasks, getCompletedUserTasks } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

  const { getUserProjects } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMap, setProjectMap] = useState<Map<string, string>>(new Map());

  const { getUserNotes, addNewNote } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState("");

  const { getUserReminders, setHomeSelectedReminder } = useReminders();
  const [reminders, setReminders] = useState<Reminder[]>([])

  const router = useRouter();
  const reloadCount = Number(sessionStorage.getItem("reloadCount")) || 0;

  const { setHomeSelectedNote } = useNotes();
  const [isEditNotePopupOpen, setIsEditNotePopupOpen] = useState(false);

  const { setHomeSelectedTask } = useTasks();

  const calculateWeeklyActivity = async () => {
    const completedTasks = await getCompletedUserTasks();

    if (completedTasks) {
      let mondayCompletedTasks: number = 0;
      let tuesdayCompletedTasks: number = 0;
      let wednesdayCompletedTasks: number = 0;
      let thursdayCompletedTasks: number = 0;
      let fridayCompletedTasks: number = 0;
      let saturdayCompletedTasks: number = 0;
      let sundayCompletedTasks: number = 0;

      completedTasks.forEach((task) => {
        const completedDate = new Date(task.task_completed_date);
        const dayOfWeek = completedDate.getDay();
        switch (dayOfWeek) {
          case 0:
            sundayCompletedTasks++;
            break;
          case 1:
            mondayCompletedTasks++;
            break;
          case 2:
            tuesdayCompletedTasks++;
            break;
          case 3:
            wednesdayCompletedTasks++;
            break;
          case 4:
            thursdayCompletedTasks++;
            break;
          case 5:
            fridayCompletedTasks++;
            break;
          case 6:
            saturdayCompletedTasks++;
            break;
        }
      });

      const sunGraphic = document.querySelector(".sun-graphic");
      if (sunGraphic) {
        (sunGraphic as HTMLElement).style.height = `${
          sundayCompletedTasks * 10
        }px`;
      }

      const monGraphic = document.querySelector(".mon-graphic");
      if (monGraphic) {
        (monGraphic as HTMLElement).style.height = `${
          mondayCompletedTasks * 10
        }px`;
      }

      const tuesGraphic = document.querySelector(".tues-graphic");
      if (tuesGraphic) {
        (tuesGraphic as HTMLElement).style.height = `${
          tuesdayCompletedTasks * 10
        }px`;
      }

      const wedGraphic = document.querySelector(".wed-graphic");
      if (wedGraphic) {
        (wedGraphic as HTMLElement).style.height = `${
          wednesdayCompletedTasks * 10
        }px`;
      }

      const thurGraphic = document.querySelector(".thur-graphic");
      if (thurGraphic) {
        (thurGraphic as HTMLElement).style.height = `${
          thursdayCompletedTasks * 10
        }px`;
        console.log(thursdayCompletedTasks);
      }

      const friGraphic = document.querySelector(".fri-graphic");
      if (friGraphic) {
        (friGraphic as HTMLElement).style.height = `${
          fridayCompletedTasks * 10
        }px`;
      }

      const satGraphic = document.querySelector(".sat-graphic");
      if (satGraphic) {
        (satGraphic as HTMLElement).style.height = `${
          saturdayCompletedTasks * 10
        }px`;
      }
    }
  };

  const handleNoteClick = async (noteId: string) => {
    const note = notes.find((n) => n.note_id === noteId);
    if (note) {
      setHomeSelectedNote(note);
      router.push("/notes");
    }
  };

  const handleReminderClick = async (reminderId: string) => {
    const reminder = reminders.find((r) => r.reminder_id === reminderId);
    if (reminder) {
      setHomeSelectedReminder(reminder);
      router.push("/reminders");
    }
  };

  const handleNoteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewNote("Untitled", noteContent);
    router.push("/notes");
  };

  const handleTaskClick = async (taskId: string) => {
    const task = tasks.find((t) => t.task_id === taskId);
    if (task) {
      setHomeSelectedTask(task);
      router.push("/tasks");
    }
  };

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

  useEffect(() => {
    if (reloadCount < 2) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  useEffect(() => {
    calculateWeeklyActivity();
    const fetchTasks = async () => {
      if (user) {
        const tasks = await getUserTasks();
        const projects = await getUserProjects();

        if (tasks && projects) {
          const projectMap = new Map(
            projects.map((project) => [
              project.project_id,
              project.project_name,
            ])
          );
          setProjectMap(projectMap);

          const firstSixTasks = tasks.slice(0, 6);

          const sortedTasks = firstSixTasks.sort(
            (a, b) =>
              new Date(a.task_due_date).getTime() -
              new Date(b.task_due_date).getTime()
          );
          setTasks(sortedTasks);
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

  useEffect(() => {
    const fetchReminders = async () => {
      if (user) {
        const reminders = await getUserReminders();
        if (reminders) {
          const firstThreeReminders = reminders.slice(0, 3);
          setReminders(firstThreeReminders);
        }
      }
    };
    fetchReminders();
  }, [user, getUserReminders]);


  const notesRedirect = async () => {
    router.push("/notes");
  };

  const tasksRedirect = async () => {
    router.push("/tasks");
  };

  const remindersRedirect = async () => {
    router.push("/reminders");
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };


  if (authLoading) return <div>Loading...</div>;
  if (authError) return <div>{authError}</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="main-dashboard-page-container">
      <title>Dashboard</title>
      <div className="dashboard-page-titles">
        <h2 className="dashboard-page-titles-main-title">Dashboard</h2>
        <h4 className="dashboard-page-titles-sub-title">
          The AllInOne User Notes Page
        </h4>
      </div>

      <div className="dashboard-elements-full-container">
        <div className="dashboard-elements-full-container-layer-one">
          <div className="project-card"></div>
          <div className="project-card"></div>
          <div className="project-card"></div>
        </div>

        <div className="dashboard-elements-full-container-layer-two">
          <div className="current-tasks-container">
            <div className="current-tasks-container-header">
              <p>Upcoming (6) Tasks</p>
              <p className="view-all-text" onClick={tasksRedirect}>
                View All →
              </p>
            </div>
            <div className="current-tasks-inner-container">
              {tasks.map((task) => (
                <div
                  key={task.task_id}
                  className="task-card"
                  onClick={() => handleTaskClick(task.task_id)}
                >
                  <Image
                    src={tasksIcon}
                    alt="Tasks Icon"
                    width={30}
                    height={30}
                  />
                  <div className="task-card-text">
                    <p className="task-title-name">{task.task_name}</p>
                    <p className="task-project-name">
                      {projectMap.get(task.project_id) || "No Project"},{" "}
                      {formatDate(task.task_due_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="current-notes-container">
            <div className="current-notes-container-header">
              <p>Latest (3) Notes</p>
              <p className="view-all-text" onClick={notesRedirect}>
                View All →
              </p>
            </div>
            <div className="current-notes-inner-container">
              {notes.map((note) => (
                <div
                  key={note.note_id}
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

          <div className="current-reminders-container">
            <div className="current-reminders-container-header">
              <p>Latest (3) Reminders</p>
              <p className="view-all-text" onClick={remindersRedirect}>
                View All →
              </p>
            </div>
            <div className="current-reminders-inner-container">
            {reminders.map((reminder) => (
                <div
                  key={reminder.reminder_id}
                  className="reminder-card"
                  onClick={() => handleReminderClick(reminder.reminder_id)}
                >
                  <Image
                    src={remindersIcon}
                    alt="Reminder Icon"
                    width={30}
                    height={30}
                  />
                  <div className="reminder-card-text">
                  <p className="reminder-card-subtext-one">{formatDateTime(reminder.reminder_datetime)}</p>
                  <p className="reminder-card-subtext-two">{reminder.reminder_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-elements-full-container-layer-three">
          <div className="weekly-activity-container">
            <div>
              <div className="weekly-activity-container-header">
                <p>Weekly Activity</p>
              </div>

              <div className="weekly-activity-inner-container">
                <div className="weekly-activity-card">
                  <div className="sun-graphic" data-day="Sun"></div>
                  <div className="mon-graphic" data-day="Mon"></div>
                  <div className="tues-graphic" data-day="Tue"></div>
                  <div className="wed-graphic" data-day="Wed"></div>
                  <div className="thur-graphic" data-day="Thur"></div>
                  <div className="fri-graphic" data-day="Fri"></div>
                  <div className="sat-graphic" data-day="Sat"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-notes-container">
            <form onSubmit={handleNoteSubmit}>
              <div className="quick-notes-container-header">
                <p>Quick Notes</p>
                <button type="submit" className="view-all-text">
                  Save →
                </button>
              </div>
              <div className="quick-notes-inner-container">
                <textarea
                  className="quick-notes-card"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                ></textarea>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
