import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  CheckIcon,
  Trash2,
  Heart,
  LayoutGrid,
  Palette,
  Crown,
  Camera,
  Smile,
  Star,
  Video,
  Paintbrush,
  Pencil,
  Zap,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import ImageCropper from "./ImageCropper";
import {
  useGenerateUploadUrl,
  useGenerateImage,
  useGenerateViewUrl,
} from "@/hooks/use-pageSetting";
import { generalService } from "@/api/general.service";
import toast from "react-hot-toast";

export default function PageSettingsIllustration({
  eventId,
  generatedImage,
  setGeneratedImage,
  rawImageKey,
  setRawImageKey,
  activeFormat,
  handleFormatToggle,
}: {
  eventId: string | null;
  generatedImage: string | null;
  setGeneratedImage: (val: string | null, key?: string | null) => void;
  rawImageKey: string | null;
  setRawImageKey: (val: string | null) => void;
  activeFormat?: any;
  handleFormatToggle?: (key: string, value: any) => void;
}) {
  const [coupleImage, setCoupleImage] = useState<string | null>(null);
  const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [illustrationTheme, setIllustrationTheme] = useState(
    activeFormat?.illustration_theme || "traditional",
  );
  const [illustrationStyle, setIllustrationStyle] = useState(
    activeFormat?.illustration_style || "royal_regal_portrait",
  );
  const [photoType, setPhotoType] = useState<"couple" | "bride" | "groom">(
    activeFormat?.photo_type || "couple",
  );
  const [attire, setAttire] = useState(() => {
    const val =
      activeFormat?.bride_attire_style || activeFormat?.groom_attire_style;
    if (!val || val === "Default / Let style decide") return "default";
    return val;
  });
  const [brideAttire, setBrideAttire] = useState(() => {
    const val = activeFormat?.bride_attire_style;
    if (!val || val === "Default / Let style decide") return "default";
    return val;
  });
  const [groomAttire, setGroomAttire] = useState(() => {
    const val = activeFormat?.groom_attire_style;
    if (!val || val === "Default / Let style decide") return "default";
    return val;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (handleFormatToggle && activeFormat?.raw_image) {
      if (!activeFormat?.illustration_theme)
        handleFormatToggle("illustration_theme", "traditional");
      if (!activeFormat?.illustration_style)
        handleFormatToggle("illustration_style", "royal_regal_portrait");
      if (!activeFormat?.photo_type) handleFormatToggle("photo_type", "couple");
      if (!activeFormat?.bride_attire_style)
        handleFormatToggle("bride_attire_style", "default");
      if (!activeFormat?.groom_attire_style)
        handleFormatToggle("groom_attire_style", "default");
    }
  }, [
    activeFormat?.raw_image,
    activeFormat?.illustration_theme,
    activeFormat?.illustration_style,
    activeFormat?.photo_type,
    activeFormat?.bride_attire_style,
    activeFormat?.groom_attire_style,
  ]);

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
      // Reset input value so same file can be selected again
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
        objectKey: `raw-images/cropped_image_${Date.now()}.jpg`,
        mimeType: "image/jpeg",
      });
      await generalService.uploadFileToS3(data.url, croppedImage.blob);
      if (!isMounted.current) return;
      prevRawImageKey.current = data.object_key;
      setRawImageKey(data.object_key);
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

      // Save to backend format payload if handler is provided
      if (handleFormatToggle) {
        handleFormatToggle("illustration_theme", illustrationTheme);
        handleFormatToggle("illustration_style", illustrationStyle);
        handleFormatToggle("photo_type", photoType);
        if (photoType === "couple") {
          handleFormatToggle("bride_attire_style", brideAttire);
          handleFormatToggle("groom_attire_style", groomAttire);
        } else if (photoType === "bride") {
          handleFormatToggle("bride_attire_style", attire);
        } else {
          handleFormatToggle("groom_attire_style", attire);
        }
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Settings */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      1. Photo Type
                    </label>
                    <div className="flex gap-2">
                      {(["couple", "bride", "groom"] as const).map((type) => (
                        <Button
                          key={type}
                          variant={photoType === type ? "default" : "outline"}
                          className="flex-1 capitalize px-2"
                          onClick={() => {
                            setPhotoType(type);
                            handleFormatToggle?.("photo_type", type);
                          }}
                          disabled={isGenerating || isUploading}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      2. Illustration Theme
                    </label>
                    <Select
                      value={illustrationTheme}
                      onValueChange={(val) => {
                        setIllustrationTheme(val);
                        handleFormatToggle?.("illustration_theme", val);
                      }}
                      disabled={isGenerating || isUploading}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">
                          Traditional Indian
                        </SelectItem>
                        <SelectItem value="modern">Modern Minimalist</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                        <SelectItem value="royal">Royal Heritage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    3. Illustration Style
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2">
                    {[
                      {
                        id: "royal_regal_portrait",
                        name: "Royal Portrait",
                        icon: Crown,
                      },
                      {
                        id: "watercolor_fine_art",
                        name: "Watercolor Dream",
                        icon: Palette,
                      },
                      {
                        id: "heritage_miniature",
                        name: "Heritage Miniature",
                        icon: Heart,
                      },
                      { id: "storybook_3d", name: "3D Storybook", icon: Smile },
                      {
                        id: "modern_line_art",
                        name: "Modern Line Art",
                        icon: LayoutGrid,
                      },
                      {
                        id: "vintage_keepsake",
                        name: "Vintage Keepsake",
                        icon: Camera,
                      },
                      { id: "anime_style", name: "Anime Style", icon: Star },
                      { id: "pop_art_bash", name: "Pop Art Bash", icon: Zap },
                      {
                        id: "fairytale_romance",
                        name: "Fairytale Romance",
                        icon: Sparkles,
                      },
                      {
                        id: "retro_cinema_poster",
                        name: "Retro Cinema Poster",
                        icon: Video,
                      },
                      {
                        id: "fun_caricature",
                        name: "Fun Caricature",
                        icon: Pencil,
                      },
                      {
                        id: "classic_oil_painting",
                        name: "Classic Oil Painting",
                        icon: Paintbrush,
                      },
                    ].map((style) => {
                      const Icon = style.icon;
                      return (
                        <div
                          key={style.id}
                          className={`cursor-pointer rounded-md border-2 overflow-hidden aspect-square transition-all relative ${
                            illustrationStyle === style.id
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent hover:border-muted-foreground/30"
                          }`}
                          onClick={() => {
                            if (!isGenerating && !isUploading) {
                              setIllustrationStyle(style.id);
                              handleFormatToggle?.(
                                "illustration_style",
                                style.id,
                              );
                            }
                          }}
                        >
                          <div
                            className={`w-full h-full flex flex-col items-center justify-center p-2 text-center bg-muted/30 hover:bg-muted/50 transition-colors ${
                              illustrationStyle === style.id
                                ? "bg-primary/5 text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Icon
                              className={`h-6 w-6 mb-2 ${illustrationStyle === style.id ? "text-primary" : "text-muted-foreground/60"}`}
                            />
                            <span className="text-[10px] leading-tight font-medium">
                              {style.name}
                            </span>
                          </div>
                          {illustrationStyle === style.id && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                              <CheckIcon className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {photoType === "couple" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        4. Bride Attire Style
                      </label>
                      <Select
                        value={brideAttire}
                        onValueChange={(val) => {
                          setBrideAttire(val);
                          handleFormatToggle?.("bride_attire_style", val);
                        }}
                        disabled={isGenerating || isUploading}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select attire" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { id: "default", name: "Default / Let style decide" },
                            { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
                            {
                              id: "sharara_sherwani",
                              name: "Sharara/Gharara & Sherwani",
                            },
                            {
                              id: "kurta_pagri_sharara",
                              name: "Kurta, Pagri & Sharara",
                            },
                            { id: "saree_bandhgala", name: "Saree & Bandhgala" },
                            {
                              id: "white_gown_tuxedo",
                              name: "White Gown & Tuxedo",
                            },
                            {
                              id: "qipao_tang_suit",
                              name: "Qipao/Cheongsam & Tang Suit",
                            },
                            { id: "hanbok", name: "Hanbok" },
                            { id: "kimono_montsuki", name: "Kimono & Montsuki" },
                            { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
                            {
                              id: "jalabiya_thobe",
                              name: "Jalabiya & Thobe-style",
                            },
                            { id: "modern_fusion", name: "Modern Fusion" },
                            { id: "surprise_me", name: "Surprise me" },
                          ].map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        5. Groom Attire Style
                      </label>
                      <Select
                        value={groomAttire}
                        onValueChange={(val) => {
                          setGroomAttire(val);
                          handleFormatToggle?.("groom_attire_style", val);
                        }}
                        disabled={isGenerating || isUploading}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select attire" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { id: "default", name: "Default / Let style decide" },
                            { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
                            {
                              id: "sharara_sherwani",
                              name: "Sharara/Gharara & Sherwani",
                            },
                            {
                              id: "kurta_pagri_sharara",
                              name: "Kurta, Pagri & Sharara",
                            },
                            { id: "saree_bandhgala", name: "Saree & Bandhgala" },
                            {
                              id: "white_gown_tuxedo",
                              name: "White Gown & Tuxedo",
                            },
                            {
                              id: "qipao_tang_suit",
                              name: "Qipao/Cheongsam & Tang Suit",
                            },
                            { id: "hanbok", name: "Hanbok" },
                            { id: "kimono_montsuki", name: "Kimono & Montsuki" },
                            { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
                            {
                              id: "jalabiya_thobe",
                              name: "Jalabiya & Thobe-style",
                            },
                            { id: "modern_fusion", name: "Modern Fusion" },
                            { id: "surprise_me", name: "Surprise me" },
                          ].map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      4. Attire Style
                    </label>
                    <Select
                      value={attire}
                      onValueChange={(val) => {
                        setAttire(val);
                        if (photoType === "bride") {
                          handleFormatToggle?.("bride_attire_style", val);
                        } else {
                          handleFormatToggle?.("groom_attire_style", val);
                        }
                      }}
                      disabled={isGenerating || isUploading}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select attire" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { id: "default", name: "Default / Let style decide" },
                          { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
                          {
                            id: "sharara_sherwani",
                            name: "Sharara/Gharara & Sherwani",
                          },
                          {
                            id: "kurta_pagri_sharara",
                            name: "Kurta, Pagri & Sharara",
                          },
                          { id: "saree_bandhgala", name: "Saree & Bandhgala" },
                          {
                            id: "white_gown_tuxedo",
                            name: "White Gown & Tuxedo",
                          },
                          {
                            id: "qipao_tang_suit",
                            name: "Qipao/Cheongsam & Tang Suit",
                          },
                          { id: "hanbok", name: "Hanbok" },
                          { id: "kimono_montsuki", name: "Kimono & Montsuki" },
                          { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
                          {
                            id: "jalabiya_thobe",
                            name: "Jalabiya & Thobe-style",
                          },
                          { id: "modern_fusion", name: "Modern Fusion" },
                          { id: "surprise_me", name: "Surprise me" },
                        ].map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <div className="flex flex-col items-center lg:sticky lg:top-6">
                <div className="w-full max-w-sm space-y-6">
                  <div className={`flex flex-col items-center ${generatedImage && !isGenerating ? 'justify-start h-auto' : 'justify-center p-6 border border-dashed rounded-xl bg-muted/30 w-full aspect-square'}`}>
                    {isGenerating ? (
                      <div className="flex flex-col items-center text-primary text-center px-4">
                        <Loader2 className="h-10 w-10 animate-spin mb-4" />
                        <p className="text-sm font-medium animate-pulse mb-4">
                          Creating your illustration...
                        </p>
                        <p className="text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md max-w-xs leading-relaxed">
                          Warning: Please do not perform any actions, switch tabs,
                          switch events, or leave this page while generation is in
                          progress. This will cause the generation to stop.
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
                        <p className="text-sm font-medium">Illustration Preview</p>
                        <p className="text-xs text-center mt-1 max-w-50">
                          Select a style and click generate to see the result here.
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
                                setRawImageKey(null);

                                // Reset local state to defaults
                                setIllustrationTheme("traditional");
                                setIllustrationStyle("royal_regal_portrait");
                                setPhotoType("couple");
                                setAttire("default");
                                setBrideAttire("default");
                                setGroomAttire("default");

                                // Send null to backend for all illustration fields
                                if (handleFormatToggle) {
                                  handleFormatToggle("illustration_theme", null);
                                  handleFormatToggle("illustration_style", null);
                                  handleFormatToggle("photo_type", null);
                                  handleFormatToggle("bride_attire_style", null);
                                  handleFormatToggle("groom_attire_style", null);
                                }
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
