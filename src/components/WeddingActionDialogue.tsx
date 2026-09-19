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
  weddingFormSchema,
  type WeddingFormValues,
} from "@/validations/wedding.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { formatDateForInput } from "@/lib/utils";

type WeddingActionDialogMode = "add" | "edit";

type WeddingActionDialogProps = {
  currentRow?: Wedding;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: WeddingActionDialogMode;
};

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

  const handleClose = () => {
    if (isPending) return;
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (values: WeddingFormValues) => {
    const onMutationSuccess = () => {
      form.reset();
      onOpenChange(false);
    };

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
                    <FormLabel required>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the wedding title"
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
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel required>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Select date"
                        autoComplete="off"
                        className="[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel required>Bride Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter bride name"
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
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel required>Groom Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter groom name"
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
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel required>Venue</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the venue"
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
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel required>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the city"
                        autoComplete="off"
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
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel required>Address</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        placeholder="Enter the address"
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
                name="message"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupTextarea
                          placeholder="Enter the message for the wedding"
                          rows={6}
                          className="min-h-24 resize-none"
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
              <Button
                type="submit"
                loading={isPending}
              >
                {isEdit ? "Save Changes" : "Add Wedding"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
