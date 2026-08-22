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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Camera,
  CheckIcon,
  Crown,
  Heart,
  ImageIcon,
  InfoIcon,
  LayoutGrid,
  Paintbrush,
  Palette,
  Smile,
  SparklesIcon,
  Star,
  UploadIcon
} from "lucide-react";
import { useState } from "react";

export default function AiCardInviteMain() {
  const [activeTab, setActiveTab] = useState<"describe" | "upload">("describe");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<"couple" | "bride" | "groom">("couple");
  const [illustrationStyle, setIllustrationStyle] = useState<string | null>(null);

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCharacterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCharacterImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 w-full items-start">
        {/* Left Column: Configuration Settings */}
        <div className="md:col-span-6 lg:col-span-7 space-y-6">
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
                      <div className="flex items-center gap-2">
                        <Label>Design Preset</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Controls the overarching aesthetic and theme of the invitation.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select a preset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimalist">Minimalist Elegance</SelectItem>
                          <SelectItem value="editorial">Modern Editorial</SelectItem>
                          <SelectItem value="botanical">Botanical Romance</SelectItem>
                          <SelectItem value="vintage">Vintage Glamour</SelectItem>
                          <SelectItem value="royal">Royal Heritage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Texture Emulation</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Adds premium digital textures like linen or velvet to the background.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select texture" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matte">Smooth Soft Matte</SelectItem>
                          <SelectItem value="linen">Textured Linen</SelectItem>
                          <SelectItem value="velvet">Velvet Touch</SelectItem>
                          <SelectItem value="handmade">Handmade Cotton Paper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Typography Pairing</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Sets the visual hierarchy between names (Hero font) and details (Body font).</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select typography" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editorial">Luxury Editorial (Serifs)</SelectItem>
                          <SelectItem value="modern">Modern Contrast (Serif + Sans)</SelectItem>
                          <SelectItem value="romantic">Romantic Script (Script + Serif)</SelectItem>
                          <SelectItem value="minimal">Ultra Clean (All Sans-Serif)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Metallic Accents</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Injects premium CSS gradients (like gold or platinum) into specific elements.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select accent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Flat Matte)</SelectItem>
                          <SelectItem value="gold">Classic Gold Foil</SelectItem>
                          <SelectItem value="champagne">Champagne Shimmer</SelectItem>
                          <SelectItem value="platinum">Platinum / Silver</SelectItem>
                          <SelectItem value="rosegold">Rose Gold Blush</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Negative Space (Padding)</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Controls how much empty breathing room exists around your text elements.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select padding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced Luxury (35% Space)</SelectItem>
                          <SelectItem value="minimal">Ultra Minimalist (50% Space)</SelectItem>
                          <SelectItem value="editorial">Grand Editorial (Wide Margins)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Monogram & Crest Style</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Defines the decorative initial block placed at the top-center of the invite.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select monogram" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Monogram</SelectItem>
                          <SelectItem value="classic">Classic Interlocking Initials</SelectItem>
                          <SelectItem value="modern">Modern Clean Typography</SelectItem>
                          <SelectItem value="floral">Fine Line Floral Crest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Text Alignment</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Enforces the structural flow of text blocks from top to bottom.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Strict Center-Aligned (Classic)</SelectItem>
                          <SelectItem value="cascading">Cascading Center</SelectItem>
                          <SelectItem value="geometric">Geometric Centered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Label>Border & Edge Styling</Label>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent><p>Determines how the outer boundary of the invitation image is finished.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select edge finish" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clean">Clean Straight Edge</SelectItem>
                          <SelectItem value="deckled">Deckled / Torn Edge (Handmade)</SelectItem>
                          <SelectItem value="bevel">Gold Foil Bevel</SelectItem>
                          <SelectItem value="filigree">Ornate Filigree Border</SelectItem>
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
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary/90 items-start">
                    <span className="text-lg leading-none">💡</span>
                    <p>
                      We'll match the layout, colour palette, borders and overall mood of your example — not copy it exactly.
                    </p>
                  </div>

                  {!uploadedImage ? (
                    <label className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group block">
                      <input type="file" className="hidden" accept="image/*" onChange={handleReferenceUpload} />
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
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" onClick={() => setUploadedImage(null)}>
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <Label>Anything to change from the example?</Label>
                    <Textarea
                      placeholder="E.g., Keep the layout but change the floral pattern to roses, make the colors darker..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Global Options: Custom Message */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Custom Invitation Message (Optional)</CardTitle>
              <CardDescription>
                Add a personalized message, quote, or cultural greeting to include on your invitation card.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="E.g., We joyfully invite you to share in our happiness..."
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Global Options: Add your photo */}
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
                    <label className="border-2 border-dashed border-muted-foreground/30 bg-background rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group block cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={handleCharacterUpload} />
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
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" onClick={() => setCharacterImage(null)}>
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {characterImage && (
                  <>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        2. Photo Type <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2 max-w-md">
                        {(["couple", "bride", "groom"] as const).map((type) => (
                          <Button
                            key={type}
                            variant={photoType === type ? "default" : "outline"}
                            className="flex-1 capitalize px-2"
                            onClick={(e) => {
                              e.preventDefault();
                              setPhotoType(type);
                            }}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Label className="text-sm font-medium mb-2 block">
                        3. Illustration Style (Optional)
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {[
                          { id: "royal_regal_portrait", name: "Royal Portrait", icon: Crown },
                          { id: "watercolor_fine_art", name: "Watercolor", icon: Palette },
                          { id: "heritage_miniature", name: "Miniature", icon: Heart },
                          { id: "storybook_3d", name: "3D Storybook", icon: Smile },
                          { id: "modern_line_art", name: "Line Art", icon: LayoutGrid },
                          { id: "vintage_keepsake", name: "Vintage", icon: Camera },
                          { id: "anime_style", name: "Anime", icon: Star },
                          { id: "classic_oil_painting", name: "Oil Painting", icon: Paintbrush },
                        ].map((style) => {
                          const Icon = style.icon;
                          return (
                            <div
                              key={style.id}
                              className={`cursor-pointer rounded-md border-2 overflow-hidden aspect-square transition-all relative ${illustrationStyle === style.id
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-transparent hover:border-muted-foreground/30"
                                }`}
                              onClick={() => setIllustrationStyle(illustrationStyle === style.id ? null : style.id)}
                            >
                              <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center p-2 text-center">
                                <Icon className="w-8 h-8 mb-2 text-primary/80" />
                                <span className="text-xs font-medium leading-tight">
                                  {style.name}
                                </span>
                              </div>
                              {illustrationStyle === style.id && (
                                <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                  <CheckIcon className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {photoType === "couple" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-2">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            4. Bride Attire Style <span className="text-destructive">*</span>
                          </Label>
                          <Select required>
                            <SelectTrigger className="w-full h-10 bg-background">
                              <SelectValue placeholder="Select attire" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { id: "default", name: "Default / Let style decide" },
                                { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
                                { id: "sharara_sherwani", name: "Sharara/Gharara & Sherwani" },
                                { id: "kurta_pagri_sharara", name: "Kurta, Pagri & Sharara" },
                                { id: "saree_bandhgala", name: "Saree & Bandhgala" },
                                { id: "white_gown_tuxedo", name: "White Gown & Tuxedo" },
                                { id: "qipao_tang_suit", name: "Qipao/Cheongsam & Tang Suit" },
                                { id: "hanbok", name: "Hanbok" },
                                { id: "kimono_montsuki", name: "Kimono & Montsuki" },
                                { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
                                { id: "jalabiya_thobe", name: "Jalabiya & Thobe-style" },
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
                          <Label className="text-sm font-medium mb-2 block">
                            5. Groom Attire Style <span className="text-destructive">*</span>
                          </Label>
                          <Select required>
                            <SelectTrigger className="w-full h-10 bg-background">
                              <SelectValue placeholder="Select attire" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { id: "default", name: "Default / Let style decide" },
                                { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
                                { id: "sharara_sherwani", name: "Sharara/Gharara & Sherwani" },
                                { id: "kurta_pagri_sharara", name: "Kurta, Pagri & Sharara" },
                                { id: "saree_bandhgala", name: "Saree & Bandhgala" },
                                { id: "white_gown_tuxedo", name: "White Gown & Tuxedo" },
                                { id: "qipao_tang_suit", name: "Qipao/Cheongsam & Tang Suit" },
                                { id: "hanbok", name: "Hanbok" },
                                { id: "kimono_montsuki", name: "Kimono & Montsuki" },
                                { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
                                { id: "jalabiya_thobe", name: "Jalabiya & Thobe-style" },
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
                      <div className="max-w-md pt-2">
                        <Label className="text-sm font-medium mb-2 block">
                          4. Attire Style <span className="text-destructive">*</span>
                        </Label>
                        <Select required>
                          <SelectTrigger className="w-full h-10 bg-background">
                            <SelectValue placeholder="Select attire" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { id: "default", name: "Default / Let style decide" },
                              { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
                              { id: "sharara_sherwani", name: "Sharara/Gharara & Sherwani" },
                              { id: "kurta_pagri_sharara", name: "Kurta, Pagri & Sharara" },
                              { id: "saree_bandhgala", name: "Saree & Bandhgala" },
                              { id: "white_gown_tuxedo", name: "White Gown & Tuxedo" },
                              { id: "qipao_tang_suit", name: "Qipao/Cheongsam & Tang Suit" },
                              { id: "hanbok", name: "Hanbok" },
                              { id: "kimono_montsuki", name: "Kimono & Montsuki" },
                              { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
                              { id: "jalabiya_thobe", name: "Jalabiya & Thobe-style" },
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Global Action Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 gap-3 group rounded-xl"
            >
              <SparklesIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {activeTab === "describe" ? "Generate Luxury Invitation" : "Generate from Reference Image"}
            </Button>
          </div>
        </div>

        {/* Right Column: Preview */}
        <Card className="border-border shadow-sm flex flex-col h-full md:col-span-6 lg:col-span-5 md:sticky md:top-6 min-h-[400px] md:min-h-[500px]">
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
    </TooltipProvider>
  );
}
