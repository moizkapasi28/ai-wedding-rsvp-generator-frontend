import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DESIGN_PRESET_OPTIONS,
  TEXTURE_EMULATION_OPTIONS,
  METALLIC_ACCENTS_OPTIONS,
  NEGATIVE_SPACE_OPTIONS,
  MONOGRAM_STYLE_OPTIONS,
  EDGE_STYLING_OPTIONS,
  TYPOGRAPHY_PAIRING_OPTIONS,
  TEXT_ALIGNMENT_OPTIONS,
} from "@/constants";
import type { AiInviteFormValues } from "@/validations/aiInviteCard.validation";
import { InfoIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";


export default function DesignConfigForm() {
  const form = useFormContext<AiInviteFormValues>();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="text-base">Design your Invitation</CardTitle>
        <CardDescription className="text-xs">
          Configure how your AI-generated invitation should look.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <FormField
            control={form.control}
            name="designPreset"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Design Preset</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Controls the overarching aesthetic and theme of the invitation.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DESIGN_PRESET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="textureEmulation"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Texture</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Adds premium digital textures like linen or velvet to the background.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select texture" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TEXTURE_EMULATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typographyPairing"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Typography</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Sets the visual hierarchy between names (Hero font) and details (Body font).</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select typography" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TYPOGRAPHY_PAIRING_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metallicAccents"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Metallic Accents</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Injects premium CSS gradients (like gold or platinum) into specific elements.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select accent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {METALLIC_ACCENTS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="negativeSpace"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Padding</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Controls how much empty breathing room exists around your text elements.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select padding" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEGATIVE_SPACE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monogramStyle"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Monogram Style</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Defines the decorative initial block placed at the top-center of the invite.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select monogram" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONOGRAM_STYLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="textAlignment"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Text Alignment</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Enforces the structural flow of text blocks from top to bottom.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TEXT_ALIGNMENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="edgeStyling"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="whitespace-nowrap text-[13px] truncate">Border Style</FormLabel>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent><p>Determines how the outer boundary of the invitation image is finished.</p></TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select edge finish" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EDGE_STYLING_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additionalDetails"
          render={({ field }) => (
            <FormItem className="space-y-1.5 pt-2">
              <FormLabel>Additional Details (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="E.g., Include watercolor elements..."
                  className="min-h-[60px] resize-none"
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
