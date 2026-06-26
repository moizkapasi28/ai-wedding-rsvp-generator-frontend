import Page, { PageHeader } from "@/components/Page";
import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from "react";
import {
  BellRingIcon,
  CheckIcon,
  ChevronRight,
  MessageSquare,
  Music,
  UsersIcon,
  Utensils,
  ImageIcon,
  Sparkles,
  Upload,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PageSettings() {
  const [coupleImage, setCoupleImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [illustrationTheme, setIllustrationTheme] = useState("traditional");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoupleImage(url);
    }
  };

  const handleGenerateCartoon = () => {
    setIsGenerating(true);
    // Simulate AI generation API call
    setTimeout(() => {
      setGeneratedImage("/indian_couple_cartoon.png");
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <Page>
      <PageHeader title="RSVP Page Settings" />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 w-full">
          <Button variant="outline" className="rounded-full">
            Mehndi
          </Button>
          <Button variant="outline" className="rounded-full">
            Sangeet
          </Button>
          <Button variant="outline" className="rounded-full">
            Wedding Ceremony
          </Button>
          <Button variant="outline" className="rounded-full">
            Reception
          </Button>
          <Button variant="outline" className="rounded-full">
            Bidai
          </Button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="default">
            <CheckIcon />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
      <div className="mt-auto grid gap-5 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-10">
            <h3 className="text-xl font-semibold">AI Couple Illustration</h3>
            <p className="text-sm text-muted-foreground">
              Upload a photo of couple to generate a beautiful AI illustration
              for your RSVP page.
            </p>
            <div className="mt-5 border border-dashed rounded-xl p-6 bg-card flex flex-col items-center justify-center text-center">
              {!coupleImage ? (
                <>
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium mb-1">Upload couple photo</h4>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                    For best results, upload a clear, front-facing photo of
                    couple.
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
                        >
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="traditional">
                              Traditional Indian
                            </SelectItem>
                            <SelectItem value="modern">
                              Modern Minimalist
                            </SelectItem>
                            <SelectItem value="watercolor">
                              Watercolor
                            </SelectItem>
                            <SelectItem value="royal">
                              Royal Heritage
                            </SelectItem>
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
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              Photo uploaded
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCoupleImage(null);
                                setGeneratedImage(null);
                              }}
                              className="h-7 text-xs px-2"
                            >
                              Change Photo
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          onClick={handleGenerateCartoon}
                          disabled={isGenerating || generatedImage !== null}
                          className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md h-11"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Generating Magic...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-5 w-5" />
                              Generate Illustration
                            </>
                          )}
                        </Button>
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
                          <p className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4" /> Illustration Ready
                          </p>
                        </div>
                      ) : isGenerating ? (
                        <div className="flex flex-col items-center text-primary">
                          <Loader2 className="h-10 w-10 animate-spin mb-4" />
                          <p className="text-sm font-medium animate-pulse">
                            Creating your illustration...
                          </p>
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
          </div>

          <div>
            <h3 className="text-xl font-semibold">Guest questions</h3>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, hic
            </p>
            <div className="mt-5 space-y-4">
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <Utensils />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <UsersIcon />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <Music />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <MessageSquare />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold">Guest list for this event</h3>
            <p className="text-sm text-muted-foreground">
              Everyone invited to the event will be listed here.
            </p>
            <div className="mt-5 space-y-4">
              <RsvpPageSettingToggleRow className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <UsersIcon />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronRight />
                </div>
              </RsvpPageSettingToggleRow>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold">WhatsApp reminders</h3>
            <p className="text-sm text-muted-foreground">
              Automatic nudges sent to guests who haven't responded yet.
            </p>
            <div className="mt-5 space-y-4">
              <RsvpPageSettingToggleRow className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <BellRingIcon />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">First Reminder</h4>
                    <p className="text-xs text-muted-foreground">
                      7 days after the invite is sent, if no response
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <BellRingIcon />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Final reminder</h4>
                    <p className="text-xs text-muted-foreground">
                      3 days before the RSVP deadline
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start mt-8 lg:mt-0">
          <RsvpPhonePreview heroImage={generatedImage} />
        </div>
      </div>
    </Page>
  );
}
