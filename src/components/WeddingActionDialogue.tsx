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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  weddingFormSchema,
  type WeddingFormValues,
} from "@/validations/wedding.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch, type Control } from "react-hook-form";
import { AddressAutocomplete } from "./custom/AddressAutocomplete";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { useCreateWedding, useUpdatWedding } from "@/hooks/use-wedding";
import type { Wedding } from "@/models/wedding.model";
import toast from "react-hot-toast";
import { cn, formatDateForInput } from "@/lib/utils";
import { getInitials, getWeddingColor } from "@/lib/weddingColor";

type WeddingActionDialogMode = "add" | "edit";

type WeddingActionDialogProps = {
  currentRow?: Wedding;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: WeddingActionDialogMode;
};

const MESSAGE_LIMIT = 250;

const getFormValues = (row?: Wedding | null): WeddingFormValues => ({
  title: row?.title ?? "",
  bride_name: row?.bride_name ?? "",
  groom_name: row?.groom_name ?? "",
  date: row?.date ? formatDateForInput(row.date) : "",
  venue: row?.venue ?? "",
  address: row?.address ?? "",
  city: row?.city ?? "",
  message: row?.message ?? "",
});

export function WeddingActionDialogue({
  currentRow,
  open,
  onOpenChange,
  mode = "add",
}: WeddingActionDialogProps) {
  const isEdit = mode === "edit";

  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: getFormValues(isEdit ? currentRow : null),
  });

  useEffect(() => {
    if (open) {
      form.reset(getFormValues(isEdit ? currentRow : null));
    }
  }, [open, isEdit, currentRow, form]);

  const createWedding = useCreateWedding();
  const updateWedding = useUpdatWedding();

  const isPending = createWedding.isPending || updateWedding.isPending;

  // One way out, used by the X, Esc, the overlay and Cancel alike — and it
  // refuses to close while a save is in flight.
  const handleOpenChange = (state: boolean) => {
    if (!state && isPending) return;
    onOpenChange(state);
  };

  const onSubmit = (values: WeddingFormValues) => {
    const onMutationSuccess = () => onOpenChange(false);

    if (isEdit) {
      if (!currentRow?.id) {
        toast.error("Missing wedding id for edit");
        return;
      }
      updateWedding.mutate(
        { id: currentRow.id, ...values },
        { onSuccess: onMutationSuccess },
      );
    } else {
      createWedding.mutate(values, { onSuccess: onMutationSuccess });
    }
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      form.setValue("address", place.formatted_address);
    }

    // Extract city from address_components
    const cityComponent = place.address_components?.find(
      (component) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_2"),
    );

    if (cityComponent) {
      form.setValue("city", cityComponent.long_name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* p-0 + flex column: the header and footer stay put and only the fields
          scroll, so a long form on a short laptop screen can't push Save off
          the bottom of the window. The cap is a percentage, not dvh — the
          dialog is fixed, so 100% already resolves against the viewport, and it
          doesn't jump when a mobile browser's toolbar slides away. */}
      <DialogContent
        className="flex max-h-[calc(100%-2rem)] flex-col overflow-hidden p-0 sm:max-w-2xl"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".pac-container")) {
            e.preventDefault();
          }
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* pr-12 keeps the text clear of the close button */}
            <DialogHeader className="flex-row items-center gap-3 border-b border-border px-5 py-4 pr-12 text-start">
              <CoupleBadge
                control={form.control}
                weddingId={isEdit ? currentRow?.id : undefined}
              />
              <div className="min-w-0">
                <DialogTitle>
                  {isEdit ? "Edit wedding" : "Add a wedding"}
                </DialogTitle>
                <DialogDescription className="mt-0.5">
                  {isEdit
                    ? "Changes show up on the invite and the RSVP page."
                    : "Start with the couple, the date and the venue."}
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* One grid, no section headings and no helper paragraphs: the
                labels already say what each field is, and every extra line is
                another line to scroll past. */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel required>Wedding title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Priya & Arjun's Wedding"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bride_name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Bride</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Priya Sharma"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groom_name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Groom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Arjun Mehta"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Date</FormLabel>
                      <FormControl>
                        {/* The picker indicator is stretched over the whole
                            field so the entire box opens the calendar; it needs
                            `relative` on the input itself to stay inside it. */}
                        <Input
                          type="date"
                          autoComplete="off"
                          className="relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Udaipur"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel required>Venue</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The Leela Palace"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel required>Address</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                          placeholder="Search the venue address"
                          onPlaceSelected={handlePlaceSelected}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => {
                    const length = (field.value ?? "").length;
                    return (
                      <FormItem className="space-y-1.5 sm:col-span-2">
                        <FormLabel>Message to guests</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupTextarea
                              placeholder="We can't wait to celebrate with you."
                              rows={3}
                              className="min-h-20 resize-none"
                              {...field}
                            />
                            <InputGroupAddon align="block-end">
                              <InputGroupText
                                className={cn(
                                  "tabular-nums",
                                  length > MESSAGE_LIMIT && "text-destructive",
                                )}
                              >
                                {length}/{MESSAGE_LIMIT}
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                {isEdit ? "Save changes" : "Add wedding"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * The same initials chip the wedding wears on its card and in the sidebar
 * switcher, filling in live as the names are typed. An existing wedding keeps
 * its real identity colour; a new one has no id to derive a colour from yet, so
 * it stays neutral rather than promising a colour it won't get.
 * Its own component so a keystroke in the name fields doesn't re-render the
 * whole form, Google address box included.
 */
function CoupleBadge({
  control,
  weddingId,
}: {
  control: Control<WeddingFormValues>;
  weddingId?: string;
}) {
  const [bride, groom] = useWatch({
    control,
    name: ["bride_name", "groom_name"],
  });
  // getInitials falls back to "W" for the card, where a wedding always has
  // names. Here it can legitimately be empty, and an empty chip that fills in
  // as you type beats a stray letter.
  const hasName = Boolean(bride?.trim() || groom?.trim());
  const initials = hasName ? getInitials(bride ?? "", groom ?? "") : "";

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-md text-xs font-bold",
        weddingId
          ? `bg-linear-to-br text-white ${getWeddingColor(weddingId)}`
          : "border border-dashed border-border text-muted-foreground",
      )}
    >
      {initials}
    </span>
  );
}
