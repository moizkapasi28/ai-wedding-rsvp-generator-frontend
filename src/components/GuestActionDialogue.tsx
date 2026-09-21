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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  guestFormSchema,
  GuestGroup,
  Side,
  type GuestFormValues,
} from "@/validations/guest.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { AddressAutocomplete } from "./custom/AddressAutocomplete";
import { PhoneInput } from "./custom/PhoneInput";
import type { Guest } from "@/models/guest.model";
import { useEffect } from "react";
import { useCreateGuest, useUpdateGuest } from "@/hooks/use-guest";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type GuestActionDialogMode = "add" | "edit";

export type EventOption = {
  id: string;
  title: string;
};

type GuestActionDialogProps = {
  currentRow?: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: GuestActionDialogMode;
  events: EventOption[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

const NOTE_LIMIT = 100;

const GROUPS: { value: string; label: string }[] = [
  { value: GuestGroup.FAMILY, label: "Family" },
  { value: GuestGroup.RELATIVE, label: "Relative" },
  { value: GuestGroup.FRIEND, label: "Friend" },
  { value: GuestGroup.COLLEAGUE, label: "Colleague" },
  { value: GuestGroup.EMPLOYEE, label: "Employee" },
  { value: GuestGroup.VIP, label: "VIP" },
  { value: GuestGroup.OTHER, label: "Other" },
];

const getFormValues = (row?: Guest | null): GuestFormValues => ({
  name: row?.name ?? "",
  mobile_number: row?.mobile_number ?? "",
  email: row?.email ?? "",
  side: row?.side ?? Side.BRIDE,
  group: row?.group ?? GuestGroup.FAMILY,
  note: row?.note ?? "",
  accomodation_required: row?.accomodation_required ?? false,
  accomodation_address: row?.accomodation_address ?? "",
  eventIds: row?.guestEventInvite.map((e) => e.event.id) ?? [],
});

export function GuestActionDialogue({
  currentRow,
  open,
  onOpenChange,
  mode = "add",
  events,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: GuestActionDialogProps) {
  const isEdit = mode === "edit";

  const eventOptions: MultiSelectOption[] = events.map((e) => ({
    value: e.id,
    label: e.title,
  }));

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: getFormValues(isEdit ? currentRow : null),
  });

  useEffect(() => {
    if (open) {
      form.reset(getFormValues(isEdit ? currentRow : null));
    }
  }, [open, isEdit, currentRow, form]);

  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();

  // Was `isPendingCreate` alone, so Save Changes never showed a spinner.
  const isPending = createGuest.isPending || updateGuest.isPending;

  const needsRoom = useWatch({
    control: form.control,
    name: "accomodation_required",
  });

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      form.setValue("accomodation_address", place.formatted_address);
    }
  };

  // One way out, used by the X, Esc, the overlay and Cancel alike — and it
  // refuses to close while a save is in flight.
  const handleOpenChange = (state: boolean) => {
    if (!state && isPending) return;
    onOpenChange(state);
  };

  const onSubmit = (values: GuestFormValues) => {
    const onMutationSuccess = () => onOpenChange(false);

    if (isEdit) {
      if (!currentRow?.id) {
        toast.error("Missing guest id for edit");
        return;
      }
      updateGuest.mutate(
        { id: currentRow.id, ...values },
        { onSuccess: onMutationSuccess },
      );
    } else {
      createGuest.mutate(values, { onSuccess: onMutationSuccess });
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
              <DialogTitle>{isEdit ? "Edit guest" : "Add a guest"}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Update their details, or change which ceremonies they are invited to."
                  : "Pick the ceremonies they are invited to, then add their details."}
              </DialogDescription>
            </DialogHeader>

            {/* One grid, no section headings and no helper paragraphs: the
                labels already say what each field is, and every extra line is
                another line to scroll past. */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                {/* First, because a guest exists to be invited to something */}
                <FormField
                  control={form.control}
                  name="eventIds"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel required>Invited to</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={eventOptions}
                          value={field.value ?? []}
                          onValueChange={field.onChange}
                          placeholder="Pick the ceremonies"
                          className="h-auto! min-h-8 w-full"
                          onScrollEnd={() => {
                            if (hasNextPage && !isFetchingNextPage)
                              fetchNextPage?.();
                          }}
                          isFetchingNextPage={isFetchingNextPage}
                        />
                      </FormControl>
                      {/* Kept: unchecking here destroys an existing invite */}
                      {isEdit && (
                        <FormDescription>
                          Removing a ceremony deletes this guest's invitation to
                          it, along with their reply.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ananya Rao"
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
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Mobile</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ananya.rao@example.com"
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
                  name="side"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Side</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Side.BRIDE}>Bride</SelectItem>
                            <SelectItem value={Side.GROOM}>Groom</SelectItem>
                            <SelectItem value={Side.BOTH}>Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel required>Group</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            {GROUPS.map((group) => (
                              <SelectItem key={group.value} value={group.value}>
                                {group.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* A yes/no was a dropdown; a switch says it in one tap, and
                    the address only appears once there's something to fill in
                    rather than sitting there greyed out. */}
                <FormField
                  control={form.control}
                  name="accomodation_required"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "flex flex-row items-center justify-between gap-4 space-y-0 rounded-lg border border-border px-3 py-2.5 sm:col-span-2",
                        needsRoom && "border-primary/40",
                      )}
                    >
                      <FormLabel className="font-normal">
                        Needs a room
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {needsRoom && (
                  <FormField
                    control={form.control}
                    name="accomodation_address"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5 sm:col-span-2">
                        <FormLabel required>Where they're staying</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            placeholder="Search the hotel or address"
                            onPlaceSelected={handlePlaceSelected}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => {
                    const length = (field.value ?? "").length;
                    return (
                      <FormItem className="space-y-1.5 sm:col-span-2">
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupTextarea
                              placeholder="Anything to remember — dietary needs, who they're travelling with."
                              rows={3}
                              className="min-h-20 resize-none"
                              {...field}
                            />
                            <InputGroupAddon align="block-end">
                              <InputGroupText
                                className={cn(
                                  "tabular-nums",
                                  length > NOTE_LIMIT && "text-destructive",
                                )}
                              >
                                {length}/{NOTE_LIMIT}
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
                {isEdit ? "Save changes" : "Add guest"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
