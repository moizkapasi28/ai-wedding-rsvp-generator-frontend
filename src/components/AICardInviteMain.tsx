import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, SparklesIcon, UploadIcon, Wand2Icon } from "lucide-react";
import { useState } from "react";

export default function AiCardInviteMain() {
  const [activeTab, setActiveTab] = useState<"describe" | "upload">("describe");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 max-w-7xl mx-auto items-start">
      {/* Left Column: Configuration Settings */}
      <div className="lg:col-span-7 space-y-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "describe" | "upload")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="describe" className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Describe with AI
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <UploadIcon className="w-4 h-4" />
              Upload Example
            </TabsTrigger>
          </TabsList>

          <TabsContent value="describe" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            {/* Card 1: Design your Invitation */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Design your Invitation</CardTitle>
                <CardDescription>
                  Configure how your AI-generated invitation should look.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Theme</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern & Minimalist</SelectItem>
                        <SelectItem value="vintage">Vintage & Retro</SelectItem>
                        <SelectItem value="floral">Botanical & Floral</SelectItem>
                        <SelectItem value="rustic">Rustic Country</SelectItem>
                        <SelectItem value="royal">Royal Heritage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Color Palette</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select color palette" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pastel">Soft Pastels</SelectItem>
                        <SelectItem value="earthy">Earthy Tones</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                        <SelectItem value="vibrant">Vibrant & Bold</SelectItem>
                        <SelectItem value="gold">Gold & Elegant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Typography Style</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select typography" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Elegant Serif</SelectItem>
                        <SelectItem value="sans">Clean Sans-Serif</SelectItem>
                        <SelectItem value="script">Playful Script</SelectItem>
                        <SelectItem value="mixed">Mixed (Modern + Script)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Vibe & Mood</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select a vibe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal & Classic</SelectItem>
                        <SelectItem value="casual">Casual & Relaxed</SelectItem>
                        <SelectItem value="fun">Fun & Quirky</SelectItem>
                        <SelectItem value="romantic">Romantic & Dreamy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label>Additional Details (Optional)</Label>
                  <Textarea
                    placeholder="E.g., Include watercolor elements, make it look like a postcard, keep the background dark..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Reference an Example</CardTitle>
                <CardDescription>
                  Upload an existing invitation design you like, and we'll use it as inspiration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!uploadedImage ? (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => setUploadedImage("https://images.unsplash.com/photo-1578326227651-6927a4457e5e?auto=format&fit=crop&q=80&w=600")}
                  >
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Click to upload</h3>
                    <p className="text-sm text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden border bg-muted group">
                      <img
                        src={uploadedImage}
                        alt="Uploaded reference"
                        className="w-full h-[200px] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" onClick={() => setUploadedImage(null)}>
                          Remove Image
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label>Anything to change from the example?</Label>
                      <Textarea
                        placeholder="E.g., Keep the layout but change the floral pattern to roses, make the colors darker..."
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Global Options: Add your photo */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Add your Photo (Optional)</CardTitle>
            <CardDescription>
              Upload photos of the bride and groom to include in the design, and select their attire.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bride Photo & Attire */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Bride</Label>
                </div>
                <div className="border-2 border-dashed border-muted-foreground/30 bg-background rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                  <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Upload Photo</span>
                </div>
                <div className="space-y-1.5">
                  <Label>Attire Style</Label>
                  <Select>
                    <SelectTrigger className="w-full h-10 bg-background">
                      <SelectValue placeholder="Select attire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional Lehenga</SelectItem>
                      <SelectItem value="modern">Modern Gown</SelectItem>
                      <SelectItem value="saree">Elegant Saree</SelectItem>
                      <SelectItem value="western">Western Dress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Groom Photo & Attire */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Groom</Label>
                </div>
                <div className="border-2 border-dashed border-muted-foreground/30 bg-background rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                  <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Upload Photo</span>
                </div>
                <div className="space-y-1.5">
                  <Label>Attire Style</Label>
                  <Select>
                    <SelectTrigger className="w-full h-10 bg-background">
                      <SelectValue placeholder="Select attire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional Sherwani</SelectItem>
                      <SelectItem value="modern">Modern Suit</SelectItem>
                      <SelectItem value="kurta">Kurta Pajama</SelectItem>
                      <SelectItem value="tuxedo">Tuxedo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Action Button */}
        <div className="flex justify-end pt-2">
          <Button size="lg" className="gap-2 w-full sm:w-auto cursor-pointer">
            <Wand2Icon className="w-4 h-4" />
            {activeTab === "describe" ? "Generate Design" : "Generate from Reference"}
          </Button>
        </div>
      </div>

      {/* Right Column: Preview */}
      <Card className="border-border shadow-sm flex flex-col h-full lg:col-span-5 lg:sticky lg:top-6 min-h-[500px]">
        <CardHeader>
          <CardTitle>Design Preview</CardTitle>
          <CardDescription>
            Your generated invitation will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-6 bg-muted/30 m-6 mt-0 rounded-lg border-2 border-dashed">
          <div className="text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full mx-auto w-fit">
              <SparklesIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
              Configure your preferences on the left and click generate to see the magic.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
