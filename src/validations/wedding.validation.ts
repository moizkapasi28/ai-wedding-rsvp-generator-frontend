import { z } from "zod";

export const weddingFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100)
    .describe("Example: John and Jane's Wedding"),
  bride_name: z
    .string()
    .min(1, "Bride name is required")
    .min(3, "Bride name must be at least 3 characters")
    .max(50)
    .describe("Example: Jane Doe"),
  groom_name: z
    .string()
    .min(1, "Groom name is required")
    .max(50)
    .describe("Example: John Smith"),
  date: z
    .string()
    .min(1, "Date is required")
    .regex(
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2}))?$/,
      "Invalid date format. Please use YYYY-MM-DD or ISO 8601 format (e.g., 2026-10-15)",
    )
    .describe("Example: 2026-10-15"),
  venue: z
    .string()
    .trim()
    .min(1, "Venue is required")
    .max(200)
    .describe("Example: The Grand Hotel, New York"),
  address: z
    .string("Address is required")
    .trim()
    .min(1, "Address is required")
    .max(200)
    .describe("Example: The Grand Hotel, New York"),
  city: z
    .string()
    .min(1, "City is required")
    .max(50)
    .describe("Example: New York"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(3, "Message must be at least 3 characters")
    .max(250, "Message must be at most 250 characters")
    .optional()
    .describe("Example: We can't wait to celebrate with you!"),
});

export type WeddingFormValues = z.infer<typeof weddingFormSchema>;
