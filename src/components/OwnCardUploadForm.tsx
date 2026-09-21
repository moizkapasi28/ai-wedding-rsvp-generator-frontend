import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";

/**
 * For couples who already have an invitation. It becomes the event's card
 * exactly as a generated one would — Guest Preview and WhatsApp pick it up.
 */
export default function OwnCardUploadForm({
  onUpload,
  isUploading,
  hasCard,
  isGenerating,
  disabled,
}: {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  hasCard: boolean;
  isGenerating: boolean;
  disabled: boolean;
}) {
  const blocked = disabled || isGenerating || isUploading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Use your own invitation</CardTitle>
        <CardDescription>
          Already have a card? Upload it and guests get it exactly as it is —
          nothing is generated. It appears in the preview once it's uploaded.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label
          aria-disabled={blocked}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center transition-colors",
            blocked
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-muted/50",
          )}
        >
          <Input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={onUpload}
            disabled={blocked}
          />
          {isUploading ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" />
          )}
          <span className="mt-3 text-sm font-medium">
            {isUploading
              ? "Uploading…"
              : hasCard
                ? "Replace the current card"
                : "Click to upload your card"}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground">
            JPG, PNG or WebP, up to 20 MB
          </span>
        </label>

        {/* A run in progress would finish and overwrite the upload */}
        {isGenerating && (
          <p className="text-xs text-muted-foreground">
            A card is being generated right now. Upload once it's finished.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
