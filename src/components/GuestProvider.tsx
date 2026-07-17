import type { Guest } from "@/models/guest.model";
import React, { useState } from "react";

type GuestDialogType = "add" | "edit" | "delete";

type GuestContextType = {
  open: GuestDialogType | null;
  setOpen: (str: GuestDialogType | null) => void;
  currentRow: Guest | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Guest | null>>;
};

const GuestContext = React.createContext<GuestContextType | null>(null);

export default function GuestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<GuestDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Guest | null>(null);

  return (
    <GuestContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
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
