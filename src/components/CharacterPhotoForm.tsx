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
} from "@/constants";
import { CheckIcon, ImageIcon, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { AiInviteFormValues } from "./aiInviteCardSchema";

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


  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Add your Photo (Optional)</CardTitle>
        <CardDescription>
          Upload photos of the bride and groom to include in the design, and select their attire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary/90 items-start">
            <span className="text-lg leading-none">💡</span>
            <p>
              Upload a clear, front-facing photo of the couple. Our AI will seamlessly transform it into a beautiful custom illustration for your invitation.
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary/90 items-start">
            <span className="text-lg leading-none">🔒</span>
            <p>
              Face should be clear and front-facing for best results. Used only to generate this invite, never shared.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="max-w-2xl">
            <Label className="text-sm font-medium mb-2 block">
              1. Upload Photo
            </Label>
            {!characterImage ? (
              <label className="border-2 border-dashed border-muted-foreground/30 bg-background rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group block">
                <Input type="file" className="hidden" accept="image/*" onChange={handleCharacterUpload} />
                <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Click to Upload</span>
                <span className="text-xs text-muted-foreground mt-1">Upload a clear front-facing photo</span>
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border bg-muted group mt-2">
                <img
                  src={characterImage}
                  alt="Uploaded character"
                  className="w-full h-[200px] object-cover"
                />
                {isUploadingCharacter && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                    <span className="text-xs text-white font-medium">Uploading...</span>
                  </div>
                )}
                {!isUploadingCharacter && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" onClick={onRemoveImage}>
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
                            variant={field.value === type ? "default" : "outline"}
                            className="flex-1 capitalize px-2"
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

              <FormField
                control={form.control}
                name="illustrationStyle"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <Label className="text-sm font-medium mb-2 block">
                      3. Illustration Style (Optional)
                    </Label>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {ILLUSTRATION_STYLE_OPTIONS.map((style) => {
                          const Icon = style.icon;
                          return (
                            <div
                              key={style.id}
                              className={`cursor-pointer rounded-md border-2 overflow-hidden aspect-square transition-all relative ${field.value === style.id
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-transparent hover:border-muted-foreground/30"
                                }`}
                              onClick={() => field.onChange(field.value === style.id ? null : style.id)}
                            >
                              <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center p-2 text-center">
                                <Icon className="w-8 h-8 mb-2 text-primary/80" />
                                <span className="text-xs font-medium leading-tight">
                                  {style.name}
                                </span>
                              </div>
                              {field.value === style.id && (
                                <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                  <CheckIcon className="w-3 h-3" />
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

              {photoType === "couple" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-2">
                  <FormField
                    control={form.control}
                    name="brideAttireStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-medium mb-2 block">
                          4. Bride Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10 bg-background">
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
                          5. Groom Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10 bg-background">
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
                          4. Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10 bg-background">
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
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
