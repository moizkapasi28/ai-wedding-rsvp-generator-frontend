import { MenuIcon, PlusIcon } from "lucide-react";
import { useEvent } from "./EventProvider";
import { Button } from "./ui/button";

export default function EventPrimaryButtons() {
  const { setOpen } = useEvent();
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline">
        <MenuIcon />
        <span>View as list</span>
      </Button>
      <Button variant="default" onClick={() => setOpen("add")}>
        <PlusIcon />
        <span>New Event</span>
      </Button>
    </div>
  );
}
