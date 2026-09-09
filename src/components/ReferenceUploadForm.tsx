import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AiInviteFormValues } from "@/validations/aiInviteCard.validation";
import { ImageIcon, InfoIcon, Loader2 } from "lucide-react";
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
    <Card className="border-border shadow-sm">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Reference an Example</CardTitle>
            <CardDescription className="text-xs">
              Upload an existing invitation design you like, and we'll use it as inspiration.
            </CardDescription>
          </div>
          <Tooltip>
            <TooltipTrigger type="button" className="cursor-help">
              <InfoIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3 space-y-2">
              <div className="flex gap-2 text-xs">
                <span>💡</span>
                <p>We'll try to match the layout, colour palette, borders and overall mood of your example — not copy it exactly.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 pb-3">
        <div>
          {!uploadedImage ? (
            <label className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${error ? "border-destructive/50 hover:bg-destructive/10" : "border-muted-foreground/25 hover:bg-muted/50"}`}>
              <Input type="file" className="hidden" accept="image/*" onChange={handleReferenceUpload} />
              <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-0.5">Click to upload</h3>
              <p className="text-[11px] text-muted-foreground">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </label>
          ) : (
            <div className="w-full relative rounded-xl overflow-hidden border bg-muted group">
              <img
                src={uploadedImage}
                alt="Uploaded reference"
                className="w-full h-[120px] object-cover"
              />
              {isUploadingReference && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin mb-1" />
                  <span className="text-[11px] text-white font-medium">Uploading...</span>
                </div>
              )}
              {!isUploadingReference && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" onClick={onRemoveImage}>
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          )}
          {error && <p className="text-sm font-medium text-destructive mt-2">{error.message}</p>}
        </div>

        <FormField
          control={form.control}
          name="additionalDetails"
          render={({ field }) => (
            <FormItem className="space-y-2 pt-2">
              <FormLabel>Anything to change from the example?</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="E.g. Incorporate a subtle peacock motif in the background..."
                  className="min-h-[60px] resize-y bg-background"
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
