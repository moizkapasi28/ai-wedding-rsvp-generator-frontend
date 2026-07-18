import type { Wedding } from "@/models/wedding.model";
import React, { useState } from "react";

type WeddingDialogType = "add" | "edit" | "delete";

type WeddingContextType = {
  open: WeddingDialogType | null;
  setOpen: (str: WeddingDialogType | null) => void;
  currentRow: Wedding | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Wedding | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filter: string[];
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
};

const WeddingContext = React.createContext<WeddingContextType | null>(null);

export default function WeddingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<WeddingDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Wedding | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  return (
    <WeddingContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        search,
        setSearch,
        filter,
        setFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export const useWedding = () => {
  const weddingContext = React.useContext(WeddingContext);

  if (!weddingContext) {
    throw new Error(" useWedding must be used within a WeddingProvider.");
  }

  return weddingContext;
};
