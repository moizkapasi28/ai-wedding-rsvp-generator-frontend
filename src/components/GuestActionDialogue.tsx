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
import {
  guestFormSchema,
  GuestGroup,
  Side,
  type GuestFormValues,
} from "@/validations/guest.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";

import { AddressAutocomplete } from "./custom/AddressAutocomplete";

import { Calendar, Contact, Home, Mail, User, Users } from "lucide-react";
import { PhoneInput } from "./custom/PhoneInput";
import type { Guest } from "@/models/guest.model";
import { useEffect } from "react";
import { useCreateGuest, useUpdateGuest } from "@/hooks/use-guest";
import toast from "react-hot-toast";

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

type GuestActionDialogProps = {
  currentRow?: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: GuestActionDialogMode;
  events?: EventOption[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

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
  events = STATIC_EVENTS,
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

  const isPendingCreate = createGuest.isPending;
  const isPendingUpdate = updateGuest.isPending;

  const isAccommodationRequired = form.watch("accomodation_required");

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      form.setValue("accomodation_address", place.formatted_address);
    }
  };

  const handleClose = () => {
    if (isPendingCreate || isPendingUpdate) return;
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (values: GuestFormValues) => {
    const onMutationSuccess = () => {
      form.reset();
      onOpenChange(false);
    };

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
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent
        className="w-full sm:max-w-2xl"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".pac-container")) {
            e.preventDefault();
          }
        }}
      >
        <Form {...form}>
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
              <FormField
                control={form.control}
                name="eventIds"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>
                      {isEdit ? "Event Invitations" : "Events"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10 pointer-events-none" />
                        <MultiSelect
                          options={eventOptions}
                          value={field.value ?? []}
                          onValueChange={field.onChange}
                          placeholder="Select events to invite this guest to"
                          className="pl-11 min-h-10 h-auto! rounded-md bg-white/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-950/60 hover:bg-white/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                          onScrollEnd={() => {
                            if (
                              hasNextPage &&
                              !isFetchingNextPage &&
                              fetchNextPage
                            ) {
                              fetchNextPage();
                            }
                          }}
                          isFetchingNextPage={isFetchingNextPage}
                        />
                      </div>
                    </FormControl>
                    {isEdit && (
                      <FormDescription>
                        Unchecking an event will remove this guest's invitation
                        from that event.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Guest profile (2-column grid) ── */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pb-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter guest's full name"
                          autoComplete="off"
                          className="pl-11 h-10 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Mobile Number</FormLabel>
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
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          autoComplete="off"
                          className="pl-11 h-10 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="side"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Side</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10 pointer-events-none" />
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full pl-11 h-10! rounded-md bg-white/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-950/60 hover:bg-white/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm">
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Side.BRIDE}>Bride</SelectItem>
                            <SelectItem value={Side.GROOM}>Groom</SelectItem>
                            <SelectItem value={Side.BOTH}>Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Contact className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10 pointer-events-none" />
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full pl-11 h-10! rounded-md bg-white/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-950/60 hover:bg-white/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={GuestGroup.FAMILY}>
                              Family
                            </SelectItem>
                            <SelectItem value={GuestGroup.FRIEND}>
                              Friend
                            </SelectItem>
                            <SelectItem value={GuestGroup.COLLEAGUE}>
                              Colleague
                            </SelectItem>
                            <SelectItem value={GuestGroup.EMPLOYEE}>
                              Employee
                            </SelectItem>
                            <SelectItem value={GuestGroup.VIP}>VIP</SelectItem>
                            <SelectItem value={GuestGroup.RELATIVE}>
                              Relative
                            </SelectItem>
                            <SelectItem value={GuestGroup.OTHER}>
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accomodation_required"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Needs Accommodation</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10 pointer-events-none" />
                        <Select
                          value={field.value ? "yes" : "no"}
                          onValueChange={(val) => field.onChange(val === "yes")}
                        >
                          <SelectTrigger className="w-full pl-11 h-10! rounded-md bg-white/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-950/60 hover:bg-white/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accomodation_address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Accommodation Address</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        disabled={!isAccommodationRequired}
                        placeholder="Enter accommodation address"
                        onPlaceSelected={handlePlaceSelected}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pb-2">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupTextarea
                          placeholder="Enter any note for the guest (optional)"
                          rows={4}
                          className="min-h-20 resize-none bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                          {...field}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {(field.value ?? "").length}/100 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-transparent border-t-0">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isPendingCreate}>
                {isEdit ? "Save Changes" : "Add Guest"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
