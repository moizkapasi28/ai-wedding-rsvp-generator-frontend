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
}: {
  eventId: string | null;
  generatedImage: string | null;
  setGeneratedImage: (val: string | null, key?: string | null) => void;
  rawImageKey: string | null;
  setRawImageKey: (val: string | null) => void;
}) {
  const [coupleImage, setCoupleImage] = useState<string | null>(null);
  const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [illustrationTheme, setIllustrationTheme] = useState("traditional");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleGenerateCartoon = async () => {
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
      const { data } = await generateImageMutation.mutateAsync({
        rawImageKey,
        theme: illustrationTheme,
        eventId,
      });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column: Settings */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    1. Illustration Style
                  </label>
                  <Select
                    value={illustrationTheme}
                    onValueChange={setIllustrationTheme}
                    disabled={isGenerating || isUploading}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select a style" />
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

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    2. Original Photo
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

                <div className="pt-2 space-y-3">
                  <Button
                    onClick={handleGenerateCartoon}
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

              {/* Right Column: Preview */}
              <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-xl bg-muted/30 min-h-80 h-full">
                {generatedImage ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full">
                    <div className="w-full max-w-70 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl mb-4">
                      <img
                        src={generatedImage}
                        alt="Generated Cartoon"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center w-full max-w-70 px-1 mt-1">
                      <p className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                        <CheckIcon className="w-4 h-4" /> Ready
                      </p>
                    </div>
                  </div>
                ) : isGenerating ? (
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
