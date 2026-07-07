import React, { useState } from "react";

type WeddingDialogType = "add" | "edit" | "delete";

type WeddingContextType = {
  open: WeddingDialogType | null;
  setOpen: (str: WeddingDialogType | null) => void;
};

const WeddingContext = React.createContext<WeddingContextType | null>(null);

export default function WeddingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<WeddingDialogType | null>(null);

  return (
    <WeddingContext.Provider value={{ open, setOpen }}>
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
