import { z } from "zod";

export const RsvpSettingsSchema = z.object({
  illustration_theme: z.string().nullable().optional(),
  illustration_style: z.string().nullable().optional(),
  photo_type: z.string().nullable().optional(),
  bride_attire_style: z.string().nullable().optional(),
  groom_attire_style: z.string().nullable().optional(),
  raw_image: z.string().nullable().optional(),
  generated_image: z.string().nullable().optional(),
  dietary_preference: z.boolean().default(false).optional(),
  plus_ones: z.boolean().default(false).optional(),
  song_request: z.boolean().default(false).optional(),
  message: z.boolean().default(false).optional(),
  first_reminder: z.boolean().default(false).optional(),
  final_reminder: z.boolean().default(false).optional(),
});

export type RsvpSettingsFormValues = z.infer<typeof RsvpSettingsSchema>;
