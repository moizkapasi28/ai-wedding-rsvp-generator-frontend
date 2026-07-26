import { DownloadIcon, PlusIcon, UploadIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useGuest } from "./GuestProvider";
import { useAtom } from "jotai";
import { activeWeddingIdAtom } from "@/store/store";
import { useDownloadTemplate, useUploadGuestList, useExportGuestList } from "@/hooks/use-guest";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function GuestPrimaryButtons() {
  const { setOpen, search, eventFilter, sideFilter, groupFilter } = useGuest();
  const [activeWeddingid] = useAtom(activeWeddingIdAtom);
  const { mutate: downloadTemplate, isPending: isDownloading } = useDownloadTemplate();
  const { mutate: uploadGuestList, isPending: isUploading } = useUploadGuestList();
  const { mutate: exportGuestList, isPending: isExporting } = useExportGuestList();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("File size should not exceed 5MB");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (activeWeddingid) {
      uploadGuestList(
        { id: activeWeddingid, file },
        {
          onSettled: () => {
            // Reset input after upload completes
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        }
      );
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <input 
        type="file" 
        accept=".xlsx, .xls"
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <Button variant="outline" onClick={handleImportClick} disabled={isUploading}>
        {isUploading ? <Loader2 className="animate-spin" /> : <UploadIcon />}
        <span>Import</span>
      </Button>
      <Button 
        variant="outline"
        onClick={() => {
          if (activeWeddingid) {
            exportGuestList({
              weddingId: activeWeddingid,
              search,
              events: eventFilter,
              sides: sideFilter,
              groups: groupFilter
            });
          }
        }}
        disabled={isExporting}
      >
        {isExporting ? <Loader2 className="animate-spin" /> : <DownloadIcon />}
        <span>Export</span>
      </Button>
      <Button 
        variant="default" 
        onClick={() => {
          if (activeWeddingid) {
            downloadTemplate(activeWeddingid);
          }
        }}
        disabled={isDownloading}
      >
        {isDownloading ? <Loader2 className="animate-spin" /> : <DownloadIcon />}
        <span>Export Template</span>
      </Button>
      <Button variant="default" onClick={() => setOpen("add")}>
        <PlusIcon />
        <span>Add Guest</span>
      </Button>
    </div>
  );
}
