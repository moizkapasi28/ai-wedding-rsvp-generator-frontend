/**
 * How a field is set inside the invitation — shared by the real RSVP form and
 * the preview so the two can't drift.
 *
 * Boxed inputs with rounded corners read as app chrome. A reply card is a
 * printed thing: the field is a ruled line you write on, so these strip the box
 * and keep a single hairline under the value. Focus darkens that rule instead
 * of drawing a ring around a shape that isn't there.
 */
export const inviteLabelClass =
  "text-xs font-medium text-muted-foreground";

export const inviteFieldClass =
  "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-foreground focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent";

/** The plus-ones stepper: the same ruled line, with the count centred on it. */
export const inviteStepperClass =
  "flex h-10 items-center justify-between border-0 border-b border-border px-0";

export const inviteStepperButtonClass =
  "flex size-7 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-ring hover:text-foreground";
