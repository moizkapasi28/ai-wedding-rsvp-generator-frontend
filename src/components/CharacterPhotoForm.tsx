import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  ATTIRE_STYLE_OPTIONS,
  ILLUSTRATION_STYLE_OPTIONS,
  PHOTO_PLACEMENT_OPTIONS,
} from "@/constants";
import { cn } from "@/lib/utils";
import { CheckIcon, ImageIcon, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { AiInviteFormValues } from "@/validations/aiInviteCard.validation";


interface CharacterPhotoFormProps {
  characterImage: string | null;
  isUploadingCharacter: boolean;
  handleCharacterUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: () => void;
}

export default function CharacterPhotoForm({
  characterImage,
  isUploadingCharacter,
  handleCharacterUpload,
  onRemoveImage,
}: CharacterPhotoFormProps) {
  const form = useFormContext<AiInviteFormValues>();
  const photoType = form.watch("photoType");
  const activeTab = form.watch("activeTab");
  const photoPlacement = form.watch("photoPlacement");

  // Only a reference design can already contain figures to swap faces onto;
  // describing a design from scratch always composes a fresh portrait.
  const canSwapOntoReference = activeTab === "upload";
  const composesNewPortrait = !canSwapOntoReference || photoPlacement === "FRAMED_INSET";

  // The placement question only appears in reference mode, shifting the steps after it
  const step = (n: number) => (canSwapOntoReference ? n + 1 : n);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Put the couple on the card</CardTitle>
        {/* Both halves of this were tooltips behind an info icon. They are the
            two things someone needs before uploading a face, so they are said
            here instead of hidden. */}
        <CardDescription>
          Optional. A clear, front-facing photo becomes an illustration on the
          invitation. It is used only to generate this card and never shared.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-5">
          <div className="w-full">
            <Label className="mb-2 block">1. Upload photo</Label>
            {!characterImage ? (
              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center transition-colors hover:bg-muted/50">
                <Input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleCharacterUpload} />
                <ImageIcon className="size-5 text-muted-foreground" />
                <span className="mt-3 text-sm font-medium">Click to upload</span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  JPG, PNG or WebP, up to 20 MB
                </span>
              </label>
            ) : (
              <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
                <img
                  src={characterImage}
                  alt="Uploaded character"
                  className="h-40 w-full object-cover"
                />
                {isUploadingCharacter ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50">
                    <Loader2 className="size-5 animate-spin text-white" />
                    <span className="text-xs font-medium text-white">
                      Uploading…
                    </span>
                  </div>
                ) : (
                  // Always visible: a hover-only control cannot be reached on a
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
          </div>

          {characterImage && (
            <>
              <FormField
                control={form.control}
                name="photoType"
                render={({ field }) => (
                  <FormItem>
                    <Label className="mb-2 block">
                      2. Who is in the photo{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <div className="flex gap-2 max-w-md">
                        {(["couple", "bride", "groom"] as const).map((type) => (
                          <Button
                            key={type}
                            size="sm"
                            type="button"
                            variant={field.value === type ? "default" : "outline"}
                            className="flex-1 capitalize"
                            onClick={(e) => {
                              e.preventDefault();
                              field.onChange(type);
                            }}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {canSwapOntoReference && (
                <FormField
                  control={form.control}
                  name="photoPlacement"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="mb-2 block">
                        3. How should we use your photo?{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                          {PHOTO_PLACEMENT_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => field.onChange(option.id)}
                              aria-pressed={field.value === option.id}
                              className={cn(
                                "rounded-lg border p-3 text-left transition-colors",
                                field.value === option.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-ring",
                              )}
                            >
                              <span className="block text-sm font-medium">{option.name}</span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                {option.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {canSwapOntoReference && photoPlacement === "SWAP_IN_PLACE" && (
                <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                  Your example's existing outfits, poses and art style are kept as they
                  are — only the faces change — so attire and illustration style don't
                  apply here.
                </p>
              )}

              {composesNewPortrait && (
              <FormField
                control={form.control}
                name="illustrationStyle"
                render={({ field }) => (
                  <FormItem>
                    <Label className="mb-2 block">
                      {step(3)}. Illustration style (optional)
                    </Label>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {ILLUSTRATION_STYLE_OPTIONS.map((style) => {
                          const Icon = style.icon;
                          return (
                            <button
                              key={style.id}
                              type="button"
                              aria-pressed={field.value === style.id}
                              className={cn(
                                "relative flex h-20 flex-col items-center justify-center gap-1.5 rounded-lg border p-2 text-center transition-colors",
                                field.value === style.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-ring",
                              )}
                              onClick={() => field.onChange(field.value === style.id ? null : style.id)}
                            >
                              <Icon className="size-5 text-muted-foreground" />
                              <span className="text-xs leading-tight font-medium">
                                {style.name}
                              </span>
                              {field.value === style.id && (
                                <CheckIcon className="absolute top-1.5 right-1.5 size-3 text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              )}

              {composesNewPortrait && (photoType === "couple" ? (
                <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="brideAttireStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="mb-2 block">
                          {step(4)}. Bride attire{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select attire" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ATTIRE_STYLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="groomAttireStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="mb-2 block">
                          {step(5)}. Groom attire{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select attire" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ATTIRE_STYLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="max-w-md">
                  <FormField
                    control={form.control}
                    name="singleAttireStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="mb-2 block">
                          {step(4)}. Attire <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select attire" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ATTIRE_STYLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
