import z from "zod";

export const EventSide = {
  BRIDE: "BRIDE",
  GROOM: "GROOM",
  BOTH: "BOTH",
} as const;

export type EventSide = (typeof EventSide)[keyof typeof EventSide];

export const EventSideSchema = z.enum([
  EventSide.BRIDE,
  EventSide.GROOM,
  EventSide.BOTH,
] as const);

export const eventFormSchema = z
  .object({
    weddingId: z.uuid().describe("Wedding ID is required"),
    title: z.string().min(1, "Title is required").max(100),
    description: z
      .string()
      .min(1, "Message is required")
      .max(250, "Message Can't be greater than 250 characters"),
    date: z
      .string()
      .min(1, "Date is required")
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
      .max(250)
      .describe("Example: 123 Main St, New York"),
    city: z
      .string()
      .min(1, "City is required")
      .max(50)
      .describe("Example: New York"),
    event_side: EventSideSchema.describe(
      "Event side is required (BRIDE, GROOM or BOTH)",
    ),
  })
  .superRefine((data, ctx) => {
    if (data.date && data.time) {
      const eventDateStr = data.date.split("T")[0];
      const eventDateTime = new Date(`${eventDateStr}T${data.time}:00`);
      const now = new Date();

      if (eventDateTime < now) {
        // Local today date string (YYYY-MM-DD)
        const todayStr = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .split("T")[0];

        if (eventDateStr < todayStr) {
          ctx.addIssue({
            code: "custom",
            message: "Date cannot be in the past",
            path: ["date"],
          });
        } else {
          ctx.addIssue({
            code: "custom",
            message: "Time cannot be in the past for today's events",
            path: ["time"],
          });
        }
      }
    }
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;
