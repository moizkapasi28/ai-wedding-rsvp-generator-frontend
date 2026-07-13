import React from "react";
import AutocompletePkg from "react-google-autocomplete";
const Autocomplete = (AutocompletePkg as any).default ?? AutocompletePkg;
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

export type AddressAutocompleteProps = React.ComponentProps<typeof Input> & {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
};

export const AddressAutocomplete = React.forwardRef<
  HTMLInputElement,
  AddressAutocompleteProps
>(({ className, onPlaceSelected, value, ...props }, ref) => {
  return (
    <div className="relative group">
      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
      <Autocomplete
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={onPlaceSelected}
        options={{
          types: ["geocode", "establishment"],
        }}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "pl-11 h-10 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm",
          className,
        )}
        value={value ?? ""}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
          if (props.onKeyDown) {
            props.onKeyDown(e as any);
          }
        }}
        {...(props as any)}
        ref={ref as any}
      />
    </div>
  );
});

AddressAutocomplete.displayName = "AddressAutocomplete";
