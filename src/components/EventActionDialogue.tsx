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
  eventFormSchema,
  type EventFormValues,
  EventSide,
} from "@/validations/event.validation";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type, Users, Calendar, Clock, MapPin, Building } from "lucide-react";

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
      eventSide: isEdit ? EventSide.BOTH : EventSide.BOTH,
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="text-start">
              <DialogTitle>
                {isEdit ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Update the event details below"
                  : "Add a new event to the list"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter the wedding title"
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
                name="eventSide"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Event Side</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10 pointer-events-none" />
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full pl-11 !h-10 rounded-md bg-white/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-950/60 hover:bg-white/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm">
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EventSide.BRIDE}>Bride</SelectItem>
                            <SelectItem value={EventSide.GROOM}>Groom</SelectItem>
                            <SelectItem value={EventSide.BOTH}>Both</SelectItem>
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
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          type="date"
                          placeholder="Select date"
                          autoComplete="off"
                          className="pl-11 h-10 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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
                name="time"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter time of the event"
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
                name="venue"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter the venue of the event"
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
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter the city"
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
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter the address of the venue"
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
            </div>
            <div className="pb-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupTextarea
                          placeholder="Enter the message for the wedding"
                          rows={6}
                          className="min-h-24 resize-none bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                          {...field}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {(field.value ?? "").length}/250 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormDescription>
                      Please enter a proper message as it will be displayed on
                      the RSVP page.
                    </FormDescription>
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
                {isEdit ? "Save Changes" : "Add Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
