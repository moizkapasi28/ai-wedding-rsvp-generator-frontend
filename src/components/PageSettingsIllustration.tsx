import { generalService } from "@/api/general.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTIRE_STYLE_OPTIONS, ILLUSTRATION_STYLE_OPTIONS, ILLUSTRATION_THEME_OPTIONS } from "@/constants";
import {
  useGenerateImage,
  useGenerateUploadUrl,
  useGenerateViewUrl,
} from "@/hooks/use-pageSetting";
import {
  CheckIcon,
  Download,
  ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  Upload
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageCropper from "./ImageCropper";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import { useFormContext } from "react-hook-form";

export default function PageSettingsIllustration({
  eventId,
  generatedImage,
  setGeneratedImage,
}: {
  eventId: string | null;
  generatedImage: string | null;
  setGeneratedImage: (val: string | null, key?: string | null) => void;
}) {
  const [coupleImage, setCoupleImage] = useState<string | null>(null);
  const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useFormContext<RsvpSettingsFormValues>();
  const rawImageKey = form.watch("raw_image");
  const illustrationTheme = form.watch("illustration_theme") || "traditional";
  const illustrationStyle =
    form.watch("illustration_style") || "royal_regal_portrait";
  const photoType = form.watch("photo_type") || "couple";

  const brideAttire = form.watch("bride_attire_style") || "default";
  const groomAttire = form.watch("groom_attire_style") || "default";
  const attire = brideAttire !== "default" ? brideAttire : groomAttire;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (rawImageKey) {
      if (!form.getValues("illustration_theme"))
        form.setValue("illustration_theme", "traditional");
      if (!form.getValues("illustration_style"))
        form.setValue("illustration_style", "royal_regal_portrait");
      if (!form.getValues("photo_type")) form.setValue("photo_type", "couple");
      if (!form.getValues("bride_attire_style"))
        form.setValue("bride_attire_style", "default");
      if (!form.getValues("groom_attire_style"))
        form.setValue("groom_attire_style", "default");
    }
  }, [rawImageKey, form]);

  const generateUploadUrlMutation = useGenerateUploadUrl();
  const generateImageMutation = useGenerateImage();
  const generateViewUrlMutation = useGenerateViewUrl();
  const prevRawImageKey = useRef<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (rawImageKey && rawImageKey !== prevRawImageKey.current) {
      prevRawImageKey.current = rawImageKey;
      generateViewUrlMutation
        .mutateAsync(rawImageKey)
        .then((res) => {
          if (res.data?.url) {
            setCoupleImage(res.data.url);
          }
        })
        .catch(console.error);
    } else if (!rawImageKey) {
      setCoupleImage(null);
      prevRawImageKey.current = null;
    }
  }, [rawImageKey]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUncroppedImage(url);
      setIsCropperOpen(true);
      e.target.value = "";
    }
  };

  const handleCropComplete = async (croppedImage: {
    url: string;
    blob: Blob;
  }) => {
    setCoupleImage(croppedImage.url);
    setIsUploading(true);
    try {
      const { data } = await generateUploadUrlMutation.mutateAsync({
        objectKey: `raw-images/rsvp-raw-images/cropped_image_${Date.now()}.jpg`,
        mimeType: "image/jpeg",
      });
      await generalService.uploadFileToS3(data.url, croppedImage.blob);
      if (!isMounted.current) return;
      prevRawImageKey.current = data.object_key;
      form.setValue("raw_image", data.object_key);
      toast.success("Image uploaded successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current) setIsUploading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!rawImageKey) {
      toast.error("Please upload an image first.");
      return;
    }

    if (!eventId) {
      toast.error("Please select an event first.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload: any = {
        rawImageKey,
        illustrationTheme: illustrationTheme,
        illustrationStyle: illustrationStyle,
        eventId,
        photoType,
      };

      if (photoType === "couple") {
        payload.brideAttireId = brideAttire;
        payload.groomAttireId = groomAttire;
      } else {
        payload.attireId = attire;
      }

      const { data } = await generateImageMutation.mutateAsync(payload);

      // Save to backend format payload via react-hook-form
      form.setValue("illustration_theme", illustrationTheme);
      form.setValue("illustration_style", illustrationStyle);
      form.setValue("photo_type", photoType);
      if (photoType === "couple") {
        form.setValue("bride_attire_style", brideAttire);
        form.setValue("groom_attire_style", groomAttire);
      } else if (photoType === "bride") {
        form.setValue("bride_attire_style", attire);
      } else {
        form.setValue("groom_attire_style", attire);
      }

      const viewRes = await generateViewUrlMutation.mutateAsync(data.key);
      if (!isMounted.current) return;
      setGeneratedImage(viewRes.data.url, data.key);
      toast.success("Illustration generated!");
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current) setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rsvp-illustration-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback for CORS issues
      const link = document.createElement("a");
      link.href = generatedImage;
      link.target = "_blank";
      link.download = `rsvp-illustration-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold">AI Couple RSVP Thumbnail</h3>
      <p className="text-sm text-muted-foreground">
        Upload a photo of couple to generate a beautiful AI illustration for
        your RSVP thumbnail.
      </p>

      <div className="space-y-3 mt-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary/90 items-start text-left">
          <span className="text-lg leading-none">💡</span>
          <p>
            Upload a clear, front-facing photo of the couple. Our AI will seamlessly transform it into a beautiful custom illustration for your invitation.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary/90 items-start text-left">
          <span className="text-lg leading-none">🔒</span>
          <p>
            Face should be clear and front-facing for best results. Used only to generate this invite, never shared.
          </p>
        </div>
      </div>

      <div className="mt-5 border border-dashed rounded-xl p-6 bg-card flex flex-col items-center justify-center text-center">
        {!coupleImage ? (
          <>
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-1">Upload couple photo</h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              For best results, upload a clear, front-facing photo of couple.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </>
        ) : (
          <div className="w-full text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Settings */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      1. Photo Type
                    </label>
                    <FormField
                      control={form.control}
                      name="photo_type"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <div className="flex gap-2">
                              {(["couple", "bride", "groom"] as const).map(
                                (type) => (
                                  <Button
                                    key={type}
                                    variant={
                                      field.value === type
                                        ? "default"
                                        : "outline"
                                    }
                                    className="flex-1 capitalize px-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      field.onChange(type);
                                    }}
                                    disabled={isGenerating || isUploading}
                                  >
                                    {type}
                                  </Button>
                                ),
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      2. Illustration Theme
                    </label>
                    <FormField
                      control={form.control}
                      name="illustration_theme"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Select
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                              disabled={isGenerating || isUploading}
                            >
                              <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                              <SelectContent>
                                {ILLUSTRATION_THEME_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    3. Illustration Style
                  </label>
                  <FormField
                    control={form.control}
                    name="illustration_style"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
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
                                  onClick={() => {
                                    if (!isGenerating && !isUploading) {
                                      field.onChange(style.id);
                                    }
                                  }}
                                >
                                  <div
                                    className={`w-full h-full flex flex-col items-center justify-center p-2 text-center bg-muted/30 hover:bg-muted/50 transition-colors ${field.value === style.id
                                        ? "bg-primary/5 text-primary"
                                        : "text-muted-foreground"
                                      }`}
                                  >
                                    <Icon
                                      className={`h-6 w-6 mb-2 ${field.value === style.id ? "text-primary" : "text-muted-foreground/60"}`}
                                    />
                                    <span className="text-[10px] leading-tight font-medium">
                                      {style.name}
                                    </span>
                                  </div>
                                  {field.value === style.id && (
                                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
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
                </div>

                {photoType === "couple" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        4. Bride Attire Style
                      </label>
                      <FormField
                        control={form.control}
                        name="bride_attire_style"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                                disabled={isGenerating || isUploading}
                              >
                                <SelectTrigger className="w-full bg-background">
                                  <SelectValue placeholder="Select attire" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ATTIRE_STYLE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                      {opt.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        5. Groom Attire Style
                      </label>
                      <FormField
                        control={form.control}
                        name="groom_attire_style"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                                disabled={isGenerating || isUploading}
                              >
                                <SelectTrigger className="w-full bg-background">
                                  <SelectValue placeholder="Select attire" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ATTIRE_STYLE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                      {opt.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      4. Attire Style
                    </label>
                    <FormField
                      control={form.control}
                      name={
                        photoType === "bride"
                          ? "bride_attire_style"
                          : "groom_attire_style"
                      }
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Select
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                              disabled={isGenerating || isUploading}
                            >
                              <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Select attire" />
                              </SelectTrigger>
                              <SelectContent>
                                {ATTIRE_STYLE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.id} value={opt.id}>
                                    {opt.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    5. Original Photo
                  </label>
                  <div className="flex items-center gap-4 p-3 border rounded-lg bg-background/50">
                    <div className="h-16 w-16 rounded-md overflow-hidden border shadow-sm shrink-0">
                      <img
                        src={coupleImage}
                        alt="Original"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-xs font-medium text-muted-foreground">
                        Photo uploaded
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-7 text-xs px-3"
                          disabled={isGenerating || isUploading}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Preview & Actions */}
              <div className="flex flex-col items-center lg:sticky lg:top-6 order-first lg:order-last mb-6 lg:mb-0">
                <div className="w-full max-w-sm space-y-6">
                  <div
                    className={`flex flex-col items-center ${generatedImage && !isGenerating ? "justify-start h-auto" : "justify-center p-6 border border-dashed rounded-xl bg-muted/30 w-full aspect-square"}`}
                  >
                    {isGenerating ? (
                      <div className="flex flex-col items-center text-primary text-center px-4">
                        <Loader2 className="h-10 w-10 animate-spin mb-4" />
                        <p className="text-sm font-medium animate-pulse mb-4">
                          Creating your illustration...
                        </p>
                        <p className="text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md max-w-xs leading-relaxed">
                          Warning: Please do not perform any actions, switch
                          tabs, switch events, or leave this page while
                          generation is in progress. This will cause the
                          generation to stop.
                        </p>
                      </div>
                    ) : generatedImage ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full">
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border shadow-lg bg-background">
                          <img
                            src={generatedImage}
                            alt="Generated Illustration"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between w-full px-1 mt-3">
                          <p className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4" /> Ready
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs flex items-center gap-1.5 bg-background"
                            onClick={handleDownload}
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground opacity-60">
                        <ImageIcon className="h-12 w-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">
                          Illustration Preview
                        </p>
                        <p className="text-xs text-center mt-1 max-w-50">
                          Select a style and click generate to see the result
                          here.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isGenerating || isUploading}
                      className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md h-11"
                    >
                      {isGenerating || isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {isUploading ? "Uploading..." : "Generating Magic..."}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Illustration
                        </>
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={isGenerating || isUploading}
                          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-11"
                        >
                          <Trash2 className="mr-2 h-5 w-5" />
                          Remove Images
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove Images?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove both the uploaded
                            photo and the generated illustration? This action
                            cannot be undone after changes are saved.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setCoupleImage(null);
                                setGeneratedImage(null, null);
                                form.setValue("raw_image", null);
                                form.setValue("illustration_theme", null);
                                form.setValue("illustration_style", null);
                                form.setValue("photo_type", null);
                                form.setValue("bride_attire_style", null);
                                form.setValue("groom_attire_style", null);
                              }}
                            >
                              Remove
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      {uncroppedImage && (
        <ImageCropper
          open={isCropperOpen}
          onOpenChange={setIsCropperOpen}
          imageSrc={uncroppedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
