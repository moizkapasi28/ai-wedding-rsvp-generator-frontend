import type { Event } from "@/models/event.model";
import React, { useState } from "react";

type EventDialogType = "add" | "edit" | "delete";

type EventContextType = {
  open: EventDialogType | null;
  setOpen: (str: EventDialogType | null) => void;
  currentRow: Event | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Event | null>>;
};

const EventContext = React.createContext<EventContextType | null>(null);

export default function EventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<EventDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Event | null>(null);

  return (
    <EventContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvent = () => {
  const eventContext = React.useContext(EventContext);

  if (!eventContext) {
    throw new Error("useEvent must be used within a EventProvider.");
  }

  return eventContext;
};
