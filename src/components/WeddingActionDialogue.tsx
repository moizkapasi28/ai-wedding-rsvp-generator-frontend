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
} from "@/validations/wedding.validation";
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
import { Type, Calendar, User, MapPin, Building } from "lucide-react";

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
        <Form {...form}>
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
                name="bride_name"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Bride Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter bride name"
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
                name="groom_name"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Groom Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                        <Input
                          placeholder="Enter groom name"
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
                          placeholder="Enter the venue"
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
            </div>
            <div className="pb-2">
              <FormField
                control={form.control}
                name="message"
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
                      the wedding card and RSVP page.
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
                {isEdit ? "Save Changes" : "Add Wedding"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
