import type { Guest } from "@/models/guest.model";
import React, { useState } from "react";

type GuestDialogType = "add" | "edit" | "delete";

type GuestContextType = {
  open: GuestDialogType | null;
  setOpen: (str: GuestDialogType | null) => void;
  currentRow: Guest | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Guest | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  eventFilter: string[];
  setEventFilter: React.Dispatch<React.SetStateAction<string[]>>;
  sideFilter: string[];
  setSideFilter: React.Dispatch<React.SetStateAction<string[]>>;
  groupFilter: string[];
  setGroupFilter: React.Dispatch<React.SetStateAction<string[]>>;
};

const GuestContext = React.createContext<GuestContextType | null>(null);

export default function GuestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<GuestDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string[]>([]);
  const [sideFilter, setSideFilter] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState<string[]>([]);

  return (
    <GuestContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        search,
        setSearch,
        eventFilter,
        setEventFilter,
        sideFilter,
        setSideFilter,
        groupFilter,
        setGroupFilter,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => {
  const guestContext = React.useContext(GuestContext);

  if (!guestContext) {
    throw new Error(" useGuest must be used within a GuestProvider.");
  }

  return guestContext;
};
