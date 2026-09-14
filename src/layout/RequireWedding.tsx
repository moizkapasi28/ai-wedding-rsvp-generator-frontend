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
import { Outlet, useNavigate } from "react-router-dom";

export default function RequireWedding() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const navigate = useNavigate();

  if (!activeWeddingId) {
    // Always open while there's no wedding; dismissing it goes to the weddings page
    return (
      <Dialog
        open
        onOpenChange={(isOpen) => {
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
            <Button onClick={() => navigate("/weddings")}>Go to Weddings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <Outlet />;
}
