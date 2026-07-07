import React, { useState } from "react";

type EventDialogType = "add" | "edit" | "delete";

type EventContextType = {
  open: EventDialogType | null;
  setOpen: (str: EventDialogType | null) => void;
};

const EventContext = React.createContext<EventContextType | null>(null);

export default function EventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<EventDialogType | null>(null);

  return (
    <EventContext.Provider value={{ open, setOpen }}>
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
