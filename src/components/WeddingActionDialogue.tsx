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
  weddingFormSchema,
  type WeddingFormValues,
} from "@/schemas/wedding.schema";
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

type WeddingActionDialogMode = "add" | "edit";

type WeddingActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: WeddingActionDialogMode;
};

export function WeddingActionDialogue({
  open,
  onOpenChange,
  mode = "add",
}: WeddingActionDialogProps) {
  const isEdit = mode === "edit";

  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: {
      title: isEdit ? "Tanvi & Aditya Wedding" : "",
      bride_name: isEdit ? "Tanvi" : "",
      groom_name: isEdit ? "Aditya" : "",
      date: isEdit ? "2026-06-16" : "",
      venue: isEdit ? "Taj Lands End" : "",
      city: isEdit ? "Mumbai" : "",
      message: isEdit ? "Message" : "",
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (values: WeddingFormValues) => {
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
              {isEdit ? "Edit Wedding" : "Add New Wedding"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the wedding details below"
                : "Add a new wedding to the list"}
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
              name="bride_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-bride-name">
                    Bride Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-bride-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter bride name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="groom_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-groom-name">
                    Groom Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-groom-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter groom name"
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
                    placeholder="Enter the venue"
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
              name="message"
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
                    wedding card and RSVP page.
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
              {isEdit ? "Save Changes" : "Add Wedding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
