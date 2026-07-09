import z from "zod";

export const Side = {
  BRIDE: "BRIDE",
  GROOM: "GROOM",
} as const;

export type Side = (typeof Side)[keyof typeof Side];

export const SideSchema = z.enum([Side.BRIDE, Side.GROOM] as const);

export const guestFormSchema = z.object({
  eventIds: z.array(z.uuid()).min(1, "At least one event must be selected"),
  name: z.string().min(1, "Name is required").max(50),
  mobile_number: z.string().min(1, "Mobile number is required").max(15),
  email: z.string().min(1, "Email is required").max(50),
  side: SideSchema.describe("Side is required (BRIDE or GROOM)"),
});

export type GuestFormValues = z.infer<typeof guestFormSchema>;
