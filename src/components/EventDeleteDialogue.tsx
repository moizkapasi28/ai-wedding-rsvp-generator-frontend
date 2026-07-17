import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteEvent } from "@/hooks/use-event";
import type { Event } from "@/models/event.model";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type EventDeleteDialogueProps = {
  currentRow?: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
};

export function EventDeleteDialogue({
  currentRow,
  open,
  onOpenChange,
}: EventDeleteDialogueProps) {
  const deleteEvent = useDeleteEvent();

  const handleConfirm = () => {
    if (!currentRow?.id) {
      toast.error("Missing event id for delete");
      onOpenChange(false);
      return;
    }
    deleteEvent.mutateAsync(currentRow.id);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Event</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {currentRow ? `${currentRow.title}` : "This event"}
            </span>
            ? This action cannot be undone and will permanently remove the event
            along with all its RSVP responses.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t-0 bg-transparent sm:justify-end">
          <Button
            id="event-delete-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            id="event-delete-confirm-btn"
            type="button"
            variant="destructive"
            onClick={handleConfirm}
          >
            Delete Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
