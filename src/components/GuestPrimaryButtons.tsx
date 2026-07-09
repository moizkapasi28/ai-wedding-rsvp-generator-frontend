import { DownloadIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useGuest } from "./GuestProvider";

export default function GuestPrimaryButtons() {
  const { setOpen } = useGuest();
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline">
        <DownloadIcon />
        <span>Export CSV</span>
      </Button>
      <Button variant="default" onClick={() => setOpen("add")}>
        <PlusIcon />
        <span>Add Guest</span>
      </Button>
    </div>
  );
}
