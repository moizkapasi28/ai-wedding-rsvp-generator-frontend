import type { Event, EventSort } from "@/models/event.model";
import type { EventSide } from "@/validations/event.validation";
import React, { useState } from "react";

type EventDialogType = "add" | "edit" | "delete";

type EventContextType = {
  open: EventDialogType | null;
  setOpen: (str: EventDialogType | null) => void;
  currentRow: Event | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Event | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  sideFilter: EventSide | null;
  setSideFilter: React.Dispatch<React.SetStateAction<EventSide | null>>;
  sort: EventSort;
  setSort: React.Dispatch<React.SetStateAction<EventSort>>;
  hasFilters: boolean;
  clearFilters: () => void;
};

const EventContext = React.createContext<EventContextType | null>(null);

export default function EventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<EventDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Event | null>(null);
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<EventSide | null>(null);
  const [sort, setSort] = useState<EventSort>("newest");

  const hasFilters =
    Boolean(search) || sideFilter !== null || sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setSideFilter(null);
    setSort("newest");
  };

  return (
    <EventContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        search,
        setSearch,
        sideFilter,
        setSideFilter,
        sort,
        setSort,
        hasFilters,
        clearFilters,
      }}
    >
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
