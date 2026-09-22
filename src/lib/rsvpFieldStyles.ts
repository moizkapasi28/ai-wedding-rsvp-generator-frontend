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
  // text-base md:text-sm on every field: the textarea sets its own text-base on
  // phones (16px, so iOS doesn't zoom on focus) while the select stayed at
  // text-sm, and the answers came out at two different sizes on the same card.
  "rounded-none border-0 border-b border-border bg-transparent px-0 text-base shadow-none focus-visible:border-foreground focus-visible:ring-0 md:text-sm dark:bg-transparent dark:hover:bg-transparent";

/** A select on the card: the ruled line, at the same height as the stepper. */
// data-[size=default]:h-10, not h-10: the trigger sets its own height through a
// data-attribute selector, which outranks a plain class.
export const inviteSelectClass = `w-full data-[size=default]:h-10 ${inviteFieldClass}`;

/**
 * The plus-ones stepper: the same ruled line, the same height as a select, and
 * the controls grouped at the start of the line. They used to be pushed to
 * either end of the column, which left the count stranded mid-air and lined up
 * with nothing beside it.
 */
export const inviteStepperClass =
  "flex h-10 items-center gap-2 border-0 border-b border-border px-0";

export const inviteStepperButtonClass =
  "flex size-7 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-ring hover:text-foreground";
