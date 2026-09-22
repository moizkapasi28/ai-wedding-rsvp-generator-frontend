import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AiInviteFormValues } from "@/validations/inviteCard.validation";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";


interface ReferenceUploadFormProps {
  uploadedImage: string | null;
  isUploadingReference: boolean;
  handleReferenceUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: () => void;
}

export default function ReferenceUploadForm({
  uploadedImage,
  isUploadingReference,
  handleReferenceUpload,
  onRemoveImage,
}: ReferenceUploadFormProps) {
  const form = useFormContext<AiInviteFormValues>();
  const error = form.formState.errors.referenceKey;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reference an example <span className="text-destructive">*</span>
        </CardTitle>
        {/* This was a tooltip behind an info icon. It's the one thing someone
            needs to know before uploading, so it says it here instead. */}
        <CardDescription>
          An invitation design you like. We match its layout, palette, borders
          and mood — we don't copy it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          {!uploadedImage ? (
            <label
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors",
                error
                  ? "border-destructive/50 hover:bg-destructive/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <Input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleReferenceUpload} />
              <ImageIcon className="size-5 text-muted-foreground" />
              <span className="mt-3 text-sm font-medium">Click to upload</span>
              {/* Was "SVG, PNG, JPG or GIF (max. 5MB)" — none of which matched
                  what the uploader actually accepts. */}
              <span className="mt-0.5 text-xs text-muted-foreground">
                JPG, PNG or WebP, up to 20 MB
              </span>
            </label>
          ) : (
            <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={uploadedImage}
                alt="Uploaded reference"
                className="h-40 w-full object-cover"
              />
              {isUploadingReference ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50">
                  <Loader2 className="size-5 animate-spin text-white" />
                  <span className="text-xs font-medium text-white">
                    Uploading…
                  </span>
                </div>
              ) : (
                // Always visible: a hover-only control can't be reached on a
                // touch screen.
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={onRemoveImage}
                >
                  Remove
                </Button>
              )}
            </div>
          )}
          {error && <p className="text-sm font-medium text-destructive mt-2">{error.message}</p>}
        </div>

        <FormField
          control={form.control}
          name="additionalDetails"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Anything to change from the example?</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="E.g. Incorporate a subtle peacock motif in the background..."
                  className="min-h-20 resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
