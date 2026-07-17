import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function RequireWedding() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!activeWeddingId) {
      setOpen(true);
    }
  }, [activeWeddingId]);

  if (!activeWeddingId) {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) navigate("/weddings");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Wedding First</DialogTitle>
            <DialogDescription>
              You need to create a wedding before you can access this section. Please create a wedding from the All Weddings page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/weddings");
              }}
            >
              Go to Weddings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <Outlet />;
}
