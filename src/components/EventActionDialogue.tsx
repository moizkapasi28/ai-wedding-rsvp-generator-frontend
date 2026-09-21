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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDateForInput } from "@/lib/utils";
import type { Event } from "@/models/event.model";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import {
  eventFormSchema,
  type EventFormValues,
  EventSide,
} from "@/validations/event.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AddressAutocomplete } from "./custom/AddressAutocomplete";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { useCreateEvent, useUpdatEvent } from "@/hooks/use-event";

type EventActionDialogMode = "add" | "edit";

type EventActionDialogProps = {
  currentRow?: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: EventActionDialogMode;
};

const MESSAGE_LIMIT = 250;

// The picker indicator is stretched over the whole field so the entire box
// opens it; it needs `relative` on the input itself to stay inside it.
const PICKER_FIELD =
  "relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

const getFormValues = (
  row?: Event | null,
  activeWeddingId?: string | null,
): EventFormValues => ({
  title: row?.title ?? "",
  date: row?.date ? formatDateForInput(row.date) : "",
  venue: row?.venue ?? "",
  address: row?.address ?? "",
  city: row?.city ?? "",
  description: row?.description ?? "",
  time: row?.time ?? "",
  event_side: row?.event_side ?? EventSide.BOTH,
  weddingId: row?.wedding_id ?? activeWeddingId ?? "",
});

export function EventActionDialogue({
  currentRow,
  open,
  onOpenChange,
  mode = "add",
}: EventActionDialogProps) {
  const isEdit = mode === "edit";

  const now = new Date();
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const activeWeddingId = useAtomValue(activeWeddingIdAtom);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: getFormValues(isEdit ? currentRow : null, activeWeddingId),
  });

  useEffect(() => {
    if (open) {
      form.reset(getFormValues(isEdit ? currentRow : null, activeWeddingId));
    }
  }, [open, isEdit, currentRow, form, activeWeddingId]);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdatEvent();

  const isPending = createEvent.isPending || updateEvent.isPending;

  // One way out, used by the X, Esc, the overlay and Cancel alike — and it
  // refuses to close while a save is in flight.
  const handleOpenChange = (state: boolean) => {
    if (!state && isPending) return;
    onOpenChange(state);
  };

  const onSubmit = (values: EventFormValues) => {
    const onMutationSuccess = () => onOpenChange(false);

    if (isEdit) {
      if (!currentRow?.id) {
        toast.error("Missing event id for edit");
        return;
      }
      updateEvent.mutate(
        { id: currentRow.id, ...values },
        { onSuccess: onMutationSuccess },
      );
    } else {
      createEvent.mutate(values, { onSuccess: onMutationSuccess });
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
            <DialogHeader className="gap-0.5 border-b border-border px-5 py-4 pr-12 text-start">
              <DialogTitle>{isEdit ? "Edit event" : "Add an event"}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Changes show up on this event's RSVP page straight away."
                  : "Guests you invite to this event each get their own RSVP link for it."}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sangeet"
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
                  name="event_side"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Side</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EventSide.BRIDE}>Bride</SelectItem>
                            <SelectItem value={EventSide.GROOM}>Groom</SelectItem>
                            <SelectItem value={EventSide.BOTH}>Both</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Input
                          type="date"
                          autoComplete="off"
                          min={todayStr}
                          className={PICKER_FIELD}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Start time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          autoComplete="off"
                          className={PICKER_FIELD}
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
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Venue</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Durbar Hall"
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
                  name="description"
                  render={({ field }) => {
                    const length = (field.value ?? "").length;
                    return (
                      <FormItem className="space-y-1.5 sm:col-span-2">
                        {/* Named for where it lands, not for the column it's
                            stored in — this is what guests read on the invite. */}
                        <FormLabel required>Message to guests</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupTextarea
                              placeholder="Dinner and dancing from 8pm. Dress code is festive."
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
                {isEdit ? "Save changes" : "Add event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
