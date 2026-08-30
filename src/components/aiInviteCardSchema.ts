import * as z from "zod";

export const aiInviteFormSchema = z.object({
  activeTab: z.enum(["describe", "upload"]),
  designPreset: z.string().optional(),
  textureEmulation: z.string().optional(),
  typographyPairing: z.string().optional(),
  metallicAccents: z.string().optional(),
  negativeSpace: z.string().optional(),
  monogramStyle: z.string().optional(),
  textAlignment: z.string().optional(),
  edgeStyling: z.string().optional(),
  additionalDetails: z.string().optional(),
  customMessage: z.string().optional(),
  referenceKey: z.string().nullable().optional(),
  characterKey: z.string().nullable().optional(),
  photoType: z.enum(["couple", "bride", "groom"]),
  illustrationStyle: z.string().nullable().optional(),
  brideAttireStyle: z.string().optional(),
  groomAttireStyle: z.string().optional(),
  singleAttireStyle: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.activeTab === "upload") {
    if (!data.referenceKey) {
      ctx.addIssue({
        code: "custom",
        message: "Reference image is required when in upload mode.",
        path: ["referenceKey"],
      });
    }
  }
  if (data.activeTab === "describe") {
    if (!data.designPreset) {
      ctx.addIssue({
        code: "custom",
        message: "Design preset is required.",
        path: ["designPreset"],
      });
    }
  }
});

export type AiInviteFormValues = z.infer<typeof aiInviteFormSchema>;
