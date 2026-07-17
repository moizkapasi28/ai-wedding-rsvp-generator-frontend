import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteGuest } from "@/hooks/use-guest";
import type { Guest } from "@/models/guest.model";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type GuestDeleteDialogueProps = {
  currentRow?: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
};

export function GuestDeleteDialogue({
  currentRow,
  open,
  onOpenChange,
}: GuestDeleteDialogueProps) {
  const deleteEvent = useDeleteGuest();

  const handleConfirm = () => {
    if (!currentRow?.id) {
      toast.error("Missing guest id for delete");
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
            <DialogTitle>Delete Guest</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {currentRow ? `${currentRow.name}` : "This guest"}
            </span>
            ? This action cannot be undone and will permanently remove the guest
            along with all their event invitations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t-0 bg-transparent sm:justify-end">
          <Button
            id="guest-delete-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            id="guest-delete-confirm-btn"
            type="button"
            variant="destructive"
            onClick={handleConfirm}
          >
            Delete Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
