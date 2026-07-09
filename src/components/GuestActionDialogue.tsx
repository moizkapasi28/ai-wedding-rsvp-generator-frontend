import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import {
  guestFormSchema,
  Side,
  type GuestFormValues,
} from "@/schemas/guest.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type GuestActionDialogMode = "add" | "edit";

export type EventOption = {
  id: string;
  title: string;
};

const STATIC_EVENTS: EventOption[] = [
  { id: "550e8400-e29b-41d4-a716-446655440001", title: "Mehendi" },
  { id: "550e8400-e29b-41d4-a716-446655440002", title: "Sangeet" },
  { id: "550e8400-e29b-41d4-a716-446655440003", title: "Wedding Ceremony" },
  { id: "550e8400-e29b-41d4-a716-446655440004", title: "Reception" },
];

// Static guest data for edit mode (will come from API later)
const STATIC_GUEST_EDIT = {
  name: "Moiz Kapasi",
  mobile_number: "9876543210",
  email: "moiz@example.com",
  side: Side.GROOM,
  // Pre-associated events: Mehendi + Reception
  eventIds: [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440004",
  ],
};

type GuestActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: GuestActionDialogMode;
  events?: EventOption[];
};

export function GuestActionDialogue({
  open,
  onOpenChange,
  mode = "add",
  events = STATIC_EVENTS,
}: GuestActionDialogProps) {
  const isEdit = mode === "edit";

  // Convert EventOption[] → MultiSelectOption[] for the MultiSelect component
  const eventOptions: MultiSelectOption[] = events.map((e) => ({
    value: e.id,
    label: e.title,
  }));

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      eventIds: isEdit ? STATIC_GUEST_EDIT.eventIds : [],
      name: isEdit ? STATIC_GUEST_EDIT.name : "",
      mobile_number: isEdit ? STATIC_GUEST_EDIT.mobile_number : "",
      email: isEdit ? STATIC_GUEST_EDIT.email : "",
      side: isEdit ? STATIC_GUEST_EDIT.side : undefined,
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (values: GuestFormValues) => {
    console.log(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="w-full sm:max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="text-start">
            <DialogTitle>
              {isEdit ? "Edit Guest" : "Add New Guest"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the guest details and manage their event invitations below"
                : "Add a new guest and select which events they are invited to"}
            </DialogDescription>
          </DialogHeader>

          {/* ── Event invitations (full-width) ── */}
          <div className="grid grid-cols-1 gap-y-3 py-2">
            <Controller
              name="eventIds"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-guest-events">
                    {isEdit ? "Event Invitations" : "Events"}
                  </FieldLabel>
                  <MultiSelect
                    id="form-guest-events"
                    options={eventOptions}
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                    placeholder="Select events to invite this guest to"
                    aria-invalid={fieldState.invalid}
                  />
                  {isEdit && (
                    <FieldDescription>
                      Unchecking an event will remove this guest's invitation
                      from that event.
                    </FieldDescription>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* ── Guest profile (2-column grid) ── */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pb-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-guest-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-guest-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter guest's full name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="mobile_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-guest-mobile">
                    Mobile Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-guest-mobile"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter mobile number"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-guest-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-guest-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email address"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="side"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-guest-side">Side</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-guest-side"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Side.BRIDE}>Bride</SelectItem>
                      <SelectItem value={Side.GROOM}>Groom</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <DialogFooter className="bg-transparent border-t-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Add Guest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
