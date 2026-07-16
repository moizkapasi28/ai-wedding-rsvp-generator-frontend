import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useGuest } from "./GuestProvider";

export default function GuestPrimaryButtons() {
  const { setOpen } = useGuest();
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline">
        <UploadIcon />
        <span>Import Guest List</span>
      </Button>
      <Button variant="outline">
        <DownloadIcon />
        <span>Export Guest List</span>
      </Button>
      <Button variant="default">
        <DownloadIcon />
        <span>Export Template</span>
      </Button>
      <Button variant="default" onClick={() => setOpen("add")}>
        <PlusIcon />
        <span>Add Guest</span>
      </Button>
    </div>
  );
}
