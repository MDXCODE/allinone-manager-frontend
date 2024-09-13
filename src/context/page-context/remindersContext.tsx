import React, { createContext, useContext, useState, useCallback } from "react";

export interface Reminder {
  reminder_id: string;
  user_id: string;
  reminder_name: string;
  reminder_desc: string;
  reminder_datetime: string;
  is_completed: boolean;
}

type RemindersContextType = {
    getUserReminders: () => Promise<Reminder[] | null>;
    homeSelectedReminder: Reminder | null;
    setHomeSelectedReminder:  React.Dispatch<React.SetStateAction<Reminder | null>>;
    setReminders:  React.Dispatch<React.SetStateAction<Reminder[]>>; 
    reminders: Reminder[];
    loadingReminders: boolean;
    errorReminders: string | null;
    addNewReminder: (reminderTime: string, reminderName: string) => Promise<any | null>;
    editReminder: (
      reminderId: string,
      reminderTitle: string,
      reminderName: string
    ) => Promise<any | null>;
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);


export const RemindersProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {

    const [homeSelectedReminder, setHomeSelectedReminder] = useState<Reminder | null>(null);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loadingReminders, setLoadingReminders] = useState<boolean>(false);
    const [errorReminders, setErrorReminders] = useState<string | null>(null);

    const getUserReminders = useCallback(async (): Promise<Reminder[] | null> => {
      setLoadingReminders(true);
      setErrorReminders(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/reminders/userreminders`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch user tasks: ${errorText}`);
        }

        const data = await res.json();
        return data.data;
      } catch (e) {
        if (e instanceof Error) {
          setErrorReminders(e.message);
        } else {
          setErrorReminders("An unknown error occurred");
        }
        return null;
      }
    }, []);

    const addNewReminder = async (reminderTime: string, reminderName: string) => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/reminders`;

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reminder_datetime: reminderTime,
            reminder_name: reminderName,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to add reminder:", errorText);
          throw new Error(`Failed to add reminder: ${errorText}`);
        }

        console.log("Reminder added successfully");
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.error("An unknown error occurred");
        }
        return null;
      }
    };

    const editReminder = async (
      reminderId: string,
      reminderTime: string,
      reminderTitle: string
    ) => {

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/reminders`;
      try {
        const res = await fetch(apiUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reminder_id: reminderId,
            reminder_datetime: reminderTime,
            reminder_name: reminderTitle,
          }),
          credentials: "include",
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to update reminder:", errorText);
          throw new Error(`Failed to update reminder: ${errorText}`);
        }
  
        console.log("Reminder updated successfully");
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.error("An unknown error occurred");
        }
        return null;
      }
    };

    return (
        <RemindersContext.Provider
          value={{
            homeSelectedReminder, 
            setHomeSelectedReminder, 
            setReminders,
            reminders,
            getUserReminders,
            loadingReminders,
            errorReminders,
            addNewReminder,
            editReminder
          }}
        >
          {children}
        </RemindersContext.Provider>
      );
};

export const useReminders = () => {
    const context = useContext(RemindersContext);
    if (context === undefined) {
      throw new Error("useReminders must be used within RemindersProvider");
    }
    return context;
  };
  