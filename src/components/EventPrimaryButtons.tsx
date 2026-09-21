import { PlusIcon } from "lucide-react";
import { useEvent } from "./EventProvider";
import { Button } from "./ui/button";

export default function EventPrimaryButtons() {
  const { setOpen } = useEvent();
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button onClick={() => setOpen("add")}>
        <PlusIcon />
        New event
      </Button>
    </div>
  );
}
