import z from "zod";

export const EventSide = {
  BRIDE: "BRIDE",
  GROOM: "GROOM",
  BOTH: "BOTH",
} as const;

export type EventSide = (typeof EventSide)[keyof typeof EventSide];

export const EventSideSchema = z.enum([EventSide.BRIDE, EventSide.GROOM, EventSide.BOTH] as const);

export const eventFormSchema = z.object({
  weddingId: z.uuid().describe("Wedding ID is required"),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(200),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2}))?$/,
      "Invalid date format. Please use YYYY-MM-DD or ISO 8601 format (e.g., 2026-10-15)",
    )
    .describe("Example: 2026-10-15"),
  time: z
    .string()
    .regex(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format. Example: 12:30",
    )
    .describe("Example: 12:30"),
  venue: z
    .string()
    .min(1, "Venue is required")
    .max(200)
    .describe("Example: The Grand Hotel, New York"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200)
    .describe("Example: 123 Main St, New York"),
  city: z
    .string()
    .min(1, "City is required")
    .max(50)
    .describe("Example: New York"),
  eventSide: EventSideSchema.describe("Event side is required (BRIDE, GROOM or BOTH)"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
