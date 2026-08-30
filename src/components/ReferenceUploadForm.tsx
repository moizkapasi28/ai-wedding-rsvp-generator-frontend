import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageIcon, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { AiInviteFormValues } from "./aiInviteCardSchema";

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
      <CardHeader>
        <CardTitle>Reference an Example</CardTitle>
        <CardDescription>
          Upload an existing invitation design you like, and we'll use it as inspiration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary/90 items-start">
          <span className="text-lg leading-none">💡</span>
          <p>
            We'll try to match the layout, colour palette, borders and overall mood of your example — not copy it exactly.
          </p>
        </div>

        <div>
          {!uploadedImage ? (
            <label className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group block ${error ? "border-destructive/50 hover:bg-destructive/10" : "border-muted-foreground/25 hover:bg-muted/50"}`}>
              <Input type="file" className="hidden" accept="image/*" onChange={handleReferenceUpload} />
              <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Click to upload</h3>
              <p className="text-sm text-muted-foreground">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border bg-muted group">
              <img
                src={uploadedImage}
                alt="Uploaded reference"
                className="w-full h-[200px] object-cover"
              />
              {isUploadingReference && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                  <span className="text-xs text-white font-medium">Uploading...</span>
                </div>
              )}
              {!isUploadingReference && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" onClick={onRemoveImage}>
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
                  placeholder="E.g. Incorporate a subtle peacock motif in the background, use a deep emerald green palette with gold borders..."
                  className="min-h-[100px] resize-y bg-background"
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
