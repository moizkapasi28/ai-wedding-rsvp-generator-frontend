import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDownloadTemplate,
  useExportGuestList,
  useUploadGuestList,
} from "@/hooks/use-guest";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import {
  DownloadIcon,
  FileSpreadsheet,
  Loader2,
  MoreHorizontal,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useGuest } from "./GuestProvider";
import { Button } from "./ui/button";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export default function GuestPrimaryButtons() {
  const { setOpen, search, eventFilter, sideFilter, groupFilter, sentFilter } =
    useGuest();
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useDownloadTemplate();
  const { mutate: uploadGuestList, isPending: isUploading } =
    useUploadGuestList();
  const { mutate: exportGuestList, isPending: isExporting } =
    useExportGuestList();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = isUploading || isExporting || isDownloading;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reset = () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (
      !EXCEL_TYPES.includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      toast.error("That isn't a spreadsheet. Upload an .xlsx or .xls file.");
      reset();
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("That file is over 5MB. Split the list and import again.");
      reset();
      return;
    }

    if (activeWeddingId) {
      uploadGuestList({ id: activeWeddingId, file }, { onSettled: reset });
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <input
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Import, export and the template were three buttons of equal weight,
          two of them both reading "Export". They are occasional bulk jobs, so
          they sit behind one menu and leave the row to the one daily action. */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Guest list options">
            {busy ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            Import from spreadsheet
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isDownloading || !activeWeddingId}
            onClick={() =>
              activeWeddingId && downloadTemplate(activeWeddingId)
            }
          >
            <FileSpreadsheet />
            Download import template
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isExporting || !activeWeddingId}
            onClick={() =>
              activeWeddingId &&
              exportGuestList({
                weddingId: activeWeddingId,
                search,
                events: eventFilter,
                sides: sideFilter,
                groups: groupFilter,
                inviteSent: sentFilter ?? undefined,
              })
            }
          >
            <DownloadIcon />
            Export this list
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={() => setOpen("add")}>
        <PlusIcon />
        Add guest
      </Button>
    </div>
  );
}
