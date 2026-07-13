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
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  guestFormSchema,
  Side,
  type GuestFormValues,
} from "@/validations/guest.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";

import { PhoneInput } from "./custom/PhoneInput";
import { User, Mail, Users, Calendar } from "lucide-react";

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
      side: isEdit ? STATIC_GUEST_EDIT.side : "BRIDE",
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
                          </SelectContent>
                        </Select>
                      </div>
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
              <Button type="submit">
                {isEdit ? "Save Changes" : "Add Guest"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
