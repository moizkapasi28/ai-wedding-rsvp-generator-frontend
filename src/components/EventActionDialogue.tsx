import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { eventFormSchema, type EventFormValues } from "@/schemas/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";

type EventActionDialogMode = "add" | "edit";

type EventActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: EventActionDialogMode;
};

export function EventActionDialogue({
  open,
  onOpenChange,
  mode = "add",
}: EventActionDialogProps) {
  const isEdit = mode === "edit";

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      weddingId: "",
      title: isEdit ? "Sangeet" : "",
      description: isEdit ? "this is a description" : "",
      date: isEdit ? "2026-06-16" : "",
      time: isEdit ? "12:30" : "",
      venue: isEdit ? "Taj Lands End" : "",
      address: isEdit ? "Malad West" : "",
      city: isEdit ? "Mumbai" : "",
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (values: EventFormValues) => {
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
            <DialogTitle>{isEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the event details below"
                : "Add a new event to the list"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-2">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter the wedding title"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-date">Date</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-date"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    placeholder="Select date"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="time"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-groom-name">
                    Time
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-groom-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter time of the event"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="venue"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-venue">Venue</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-venue"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter the venue of the event"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-venue">Address</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-venue"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter the address of the venue"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-city">City</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-city"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter the city"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-message">
                    Message
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-message"
                      placeholder="Enter the message for the wedding"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value ?? "").length}/250 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Please enter a proper message as it will be displayed on the
                    RSVP page.
                  </FieldDescription>
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
              {isEdit ? "Save Changes" : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
