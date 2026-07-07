import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

type WeddingDeleteDialogueProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
};

export function WeddingDeleteDialogue({
  open,
  onOpenChange,
  onConfirm,
}: WeddingDeleteDialogueProps) {
  const handleConfirm = () => {
    onConfirm?.();
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
            <DialogTitle>Delete Wedding</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">Tanvi &amp; Aditya</span>?
            This action cannot be undone and will permanently remove the wedding
            along with all its guests and events.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t-0 bg-transparent sm:justify-end">
          <Button
            id="wedding-delete-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            id="wedding-delete-confirm-btn"
            type="button"
            variant="destructive"
            onClick={handleConfirm}
          >
            Delete Wedding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
