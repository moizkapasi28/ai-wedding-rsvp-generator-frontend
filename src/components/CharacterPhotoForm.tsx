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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ATTIRE_STYLE_OPTIONS,
  ILLUSTRATION_STYLE_OPTIONS,
  PHOTO_PLACEMENT_OPTIONS,
} from "@/constants";
import { CheckIcon, ImageIcon, InfoIcon, Loader2 } from "lucide-react";
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
    <Card className="border-border shadow-sm">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Add your Photo (Optional)</CardTitle>
            <CardDescription className="text-xs">
              Upload photos of the bride and groom to include in the design, and select their attire.
            </CardDescription>
          </div>
          <Tooltip>
            <TooltipTrigger type="button" className="cursor-help">
              <InfoIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3 space-y-2">
              <div className="flex gap-2 text-xs">
                <span>💡</span>
                <p>Upload a clear, front-facing photo of the couple. Our AI will seamlessly transform it into a custom illustration.</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span>🔒</span>
                <p>Face should be clear for best results. Used only to generate this invite, never shared.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 pb-3">
        <div className="space-y-3 w-full">
          <div className="w-full">
            <Label className="text-sm font-medium mb-2 block">
              1. Upload Photo
            </Label>
            {!characterImage ? (
              <label className="w-full border-2 border-dashed border-muted-foreground/30 bg-background rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                <Input type="file" className="hidden" accept="image/*" onChange={handleCharacterUpload} />
                <ImageIcon className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">Click to Upload</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">Upload a clear front-facing photo</span>
              </label>
            ) : (
              <div className="w-full relative rounded-xl overflow-hidden border bg-muted group mt-1">
                <img
                  src={characterImage}
                  alt="Uploaded character"
                  className="w-full h-[120px] object-cover"
                />
                {isUploadingCharacter && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin mb-1" />
                    <span className="text-[11px] text-white font-medium">Uploading...</span>
                  </div>
                )}
                {!isUploadingCharacter && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary" onClick={onRemoveImage}>
                      Remove Image
                    </Button>
                  </div>
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
                    <Label className="text-sm font-medium mb-2 block">
                      2. Photo Type <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <div className="flex gap-2 max-w-md">
                        {(["couple", "bride", "groom"] as const).map((type) => (
                          <Button
                            key={type}
                            size="sm"
                            variant={field.value === type ? "default" : "outline"}
                            className="flex-1 capitalize px-2 h-8"
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
                    <FormItem className="pt-2">
                      <Label className="text-sm font-medium mb-2 block">
                        3. How should we use your photo? <span className="text-destructive">*</span>
                      </Label>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                          {PHOTO_PLACEMENT_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => field.onChange(option.id)}
                              className={`text-left rounded-lg border-2 p-3 transition-all ${field.value === option.id
                                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                : "border-muted-foreground/20 hover:border-muted-foreground/40"
                                }`}
                            >
                              <span className="block text-sm font-medium">{option.name}</span>
                              <span className="block text-[11px] text-muted-foreground mt-0.5 leading-snug">
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
                <p className="text-[11px] text-muted-foreground bg-muted/40 rounded-md p-2 leading-snug">
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
                  <FormItem className="pt-2">
                    <Label className="text-sm font-medium mb-2 block">
                      {step(3)}. Illustration Style (Optional)
                    </Label>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {ILLUSTRATION_STYLE_OPTIONS.map((style) => {
                          const Icon = style.icon;
                          return (
                            <div
                              key={style.id}
                              className={`cursor-pointer rounded-md border-2 overflow-hidden h-[60px] transition-all relative ${field.value === style.id
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent hover:border-muted-foreground/30"
                                }`}
                              onClick={() => field.onChange(field.value === style.id ? null : style.id)}
                            >
                              <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center p-1 text-center">
                                <Icon className="w-5 h-5 mb-1 text-primary/80" />
                                <span className="text-[10px] font-medium leading-tight">
                                  {style.name}
                                </span>
                              </div>
                              {field.value === style.id && (
                                <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                  <CheckIcon className="w-2 h-2" />
                                </div>
                              )}
                            </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-2">
                  <FormField
                    control={form.control}
                    name="brideAttireStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-medium mb-2 block">
                          {step(4)}. Bride Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full h-9 bg-background">
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
                        <Label className="text-sm font-medium mb-2 block">
                          {step(5)}. Groom Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full h-9 bg-background">
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
                <div className="max-w-md pt-2">
                  <FormField
                    control={form.control}
                    name="singleAttireStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-medium mb-2 block">
                          {step(4)}. Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full h-9 bg-background">
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
