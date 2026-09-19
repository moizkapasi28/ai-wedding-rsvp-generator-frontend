import React from "react";
import AutocompletePkg from "react-google-autocomplete";
// The package's CommonJS build nests the component under .default when bundled
const Autocomplete =
  (AutocompletePkg as unknown as { default?: typeof AutocompletePkg }).default ??
  AutocompletePkg;
import {
  fieldBoxClass,
  fieldFocusClass,
  fieldInvalidClass,
  Input,
} from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AddressAutocompleteProps = React.ComponentProps<typeof Input> & {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
};

export const AddressAutocomplete = React.forwardRef<
  HTMLInputElement,
  AddressAutocompleteProps
>(({ className, onPlaceSelected, value, ...props }, ref) => {
  return (
    <Autocomplete
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onPlaceSelected={onPlaceSelected}
      options={{
        types: ["geocode", "establishment"],
      }}
      // Renders its own element, so it wears the shared field classes directly
      // rather than going through <Input>.
      className={cn(
        fieldBoxClass,
        fieldFocusClass,
        fieldInvalidClass,
        "px-2.5 py-1 placeholder:text-muted-foreground",
        className,
      )}
      value={value ?? ""}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      }}
      {...props}
      ref={ref}
    />
  );
});

AddressAutocomplete.displayName = "AddressAutocomplete";
