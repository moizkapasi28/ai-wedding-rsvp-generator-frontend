import z from "zod";

export const Side = {
  BRIDE: "BRIDE",
  GROOM: "GROOM",
  BOTH: "BOTH",
} as const;

export type Side = (typeof Side)[keyof typeof Side];

export const SideSchema = z.enum([Side.BRIDE, Side.GROOM, Side.BOTH] as const);

export const GuestGroup = {
  FAMILY: "FAMILY",
  FRIEND: "FRIEND",
  RELATIVE: "RELATIVE",
  EMPLOYEE: "EMPLOYEE",
  COLLEAGUE: "COLLEAGUE",
  VIP: "VIP",
  OTHER: "OTHER",
} as const;

export type GuestGroup = (typeof GuestGroup)[keyof typeof GuestGroup];

export const GuestGroupSchema = z.enum([
  GuestGroup.FAMILY,
  GuestGroup.FRIEND,
  GuestGroup.RELATIVE,
  GuestGroup.COLLEAGUE,
  GuestGroup.VIP,
  GuestGroup.EMPLOYEE,
  GuestGroup.OTHER,
] as const);

export const guestFormBaseSchema = z.object({
  eventIds: z.array(z.uuid()).min(1, "At least one event must be selected"),
  name: z.string().min(1, "Name is required").max(50),
  mobile_number: z.string().min(1, "Mobile number is required").max(15),
  email: z.string().min(1, "Email is required").max(50),
  side: SideSchema.describe("Side is required (BRIDE or GROOM)"),
  accomodation_required: z.boolean(),
  accomodation_address: z.string().optional(),
  group: GuestGroupSchema.describe("Group is required"),
  note: z.string().max(100, "Note cannot exceed 100 characters").optional(),
});

export const guestFormSchema = guestFormBaseSchema.superRefine((data, ctx) => {
  if (data.accomodation_required && !data.accomodation_address) {
    ctx.addIssue({
      code: "custom",
      message:
        "Accommodation address is required when accommodation is requested",
      path: ["accomodation_address"],
    });
  }
});

export type GuestFormValues = z.infer<typeof guestFormBaseSchema>;
