import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The shared field box — height, radius, border, background, disabled state.
 * Custom inputs (PasswordInput, PhoneInput, AddressAutocomplete) compose these
 * instead of writing their own, so they can't drift away from <Input>.
 */
export const fieldBoxClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent text-base transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"

/** Focus ring for an element that takes focus itself. */
export const fieldFocusClass =
  "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

/** Focus ring for a wrapper whose focusable element sits inside it. */
export const fieldFocusWithinClass =
  "outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"

export const fieldInvalidClass =
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldBoxClass,
        fieldFocusClass,
        fieldInvalidClass,
        "px-2.5 py-1 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
