"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useReminders, Reminder } from "../../context/page-context/remindersContext";
import AddReminderPopupForm from "../../components/forms/reminders-page-popups/addReminderPopupForm";
import EditReminderPopupForm from "../../components/forms/reminders-page-popups/editReminderPopupForm";
import "../../css/pages-css/reminders.css";

const RemindersPage = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditReminderPopupOpen, setIsEditReminderPopupOpen] = useState(false);
  const [isAddReminderPopupOpen, setIsAddReminderPopupOpen] = useState(false);
  const {
    getUserReminders,
    setReminders,
    homeSelectedReminder,
    setHomeSelectedReminder,
    reminders,
  } = useReminders();

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedReminders = await getUserReminders();
      if (fetchedReminders) {
        setReminders(fetchedReminders);
      } else {
        setReminders([]);
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
  }, [getUserReminders, setReminders]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleEditReminder = (reminder: Reminder) => {
    setHomeSelectedReminder(reminder);
    setIsEditReminderPopupOpen(true);
  };

  useEffect(() => {
    if (homeSelectedReminder) {
      setIsEditReminderPopupOpen(true);
    }
  }, [homeSelectedReminder]);

  if (loading) {
    return <div>Loading reminders...</div>;
  }

  if (error) {
    return <div>Error loading reminders: {error}</div>;
  }

  return (
    <div className="main-reminders-page-container">
      <title>Reminders</title>
      <div className="reminders-page-title">
        <h2 className="reminders-page-titles-main-title">Reminders</h2>
        <h4 className="reminders-page-titles-sub-title">
          The AllInOne User Reminders Page
        </h4>
      </div>

      <div className="dashboard-page-content">
        <div className="all-reminders-container-box">
          <div className="all-reminders-container-box">
            <div className="all-reminders-container-title">
              <div>
                <h3>All Reminders</h3>
              </div>
              <button
                onClick={() => setIsAddReminderPopupOpen(true)}
                className="add-reminder-button"
              >
                Add Reminder
              </button>
            </div>
            <div className="add-reminders-top-border"></div>
            <div className="add-reminders-top-separator"></div>

            <div className="reminders-cards-container">
              {reminders.length === 0 ? (
                <p>No reminders available.</p>
              ) : (
                reminders.map((reminder) => (
                  <div
                    key={reminder.reminder_id}
                    onClick={() => handleEditReminder(reminder)}
                    className="individual=reminder-card"
                  >
                    <div className="individual-reminder-card-titles">
                      <p className="reminders-individual-time">
                        {formatDateTime(reminder.reminder_datetime)}
                      </p>
                      <p className="reminders-individual-title">
                        {reminder.reminder_name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AddReminderPopupForm
        isOpen={isAddReminderPopupOpen}
        onClose={() => setIsAddReminderPopupOpen(false)}
        onReminderAdded={fetchReminders}
      />

      {homeSelectedReminder && (
        <EditReminderPopupForm
          isOpen={isEditReminderPopupOpen}
          onClose={() => {
            setIsEditReminderPopupOpen(false);
            setHomeSelectedReminder(null);
          }}
          onReminderUpdated={fetchReminders}
          reminder={homeSelectedReminder}
        />
      )}
    </div>
  );
};

export default RemindersPage;
