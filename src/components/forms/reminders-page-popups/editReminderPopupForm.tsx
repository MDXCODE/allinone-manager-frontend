import React, { useState, useEffect } from "react";
import "../../../css/forms-css/popup.css";
import { useAuxRequests} from "../../../context/api-context/auxRequests";
import { useReminders, Reminder } from "../../../context/page-context/remindersContext";

interface EditReminderPopupFormProps {
    isOpen: boolean;
    onClose: () => void;
    onReminderUpdated: () => void;
    reminder: Reminder;
}

const EditReminderPopupForm: React.FC<EditReminderPopupFormProps> = ({
    isOpen,
    onClose,
    onReminderUpdated,
    reminder
  }) => {
    const extractTimeFromDatetime = (datetime: string) => {
        const date = new Date(datetime);
        return date.toISOString().split("T")[1].substring(0, 5);
      };
      const [reminderTime, setReminderTime] = useState(extractTimeFromDatetime(reminder.reminder_datetime));
    const [reminderName, setReminderName] = useState(reminder.reminder_name);

    const { editReminder } = useReminders();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const today = new Date().toISOString().split("T")[0];
        const combinedDateTime = `${today}T${reminderTime}:00`;
        const localDateTime = new Date(combinedDateTime).toISOString(); 
        await editReminder(reminder.reminder_id, localDateTime, reminderName);

        onReminderUpdated();
        setReminderTime("");
        setReminderName("");
        onClose();
      } catch (error) {
        console.error("Error updating reminder:", error);
        alert("Failed to update reminder. Please try again.");
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
                          type="time"
                          className="task-name-input"
                          placeholder="Reminder Time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <textarea
                          className="task-desc-input"
                          placeholder="Reminder Name"
                          value={reminderName}
                          onChange={(e) => setReminderName(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <button className="submit-task-button" type="submit">Edit Reminder</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

};

export default EditReminderPopupForm;