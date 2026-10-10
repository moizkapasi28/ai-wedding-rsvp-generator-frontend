import { Button } from "@/components/ui/button";

/** The body of a toast that reports something just done and offers to take it back. */
export default function UndoToast({
  message,
  onUndo,
}: {
  message: string;
  onUndo: () => void;
}) {
  return (
    <span className="flex items-center gap-3">
      {message}
      <Button size="sm" variant="outline" onClick={onUndo}>
        Undo
      </Button>
    </span>
  );
}
