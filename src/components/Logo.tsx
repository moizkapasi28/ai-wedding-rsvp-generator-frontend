import { cn } from "@/lib/utils";
import { useId } from "react";

/** The violet ring. Matches the approved preview rather than --primary, which
 *  is dark enough to disappear against the sidebar surface. */
const RING = "#8b5cf6";

/**
 * Two interlocking rings.
 *
 * The viewBox is cropped tight to the artwork (44x30) so the mark fills its
 * box — an earlier square box left the rings floating in empty space and made
 * them look half the size they were set to. Size it by height (`h-8`) and let
 * the width follow.
 *
 * The right ring is masked where it crosses the left one so it reads as
 * passing behind it; without that the strokes merge into a blob at small
 * sizes. It uses currentColor, so the mark inherits whatever it sits on.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const maskId = `logo-behind-${id}`;

  return (
    <svg
      viewBox="0 0 44 30"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-auto shrink-0", className)}
    >
      <mask id={maskId}>
        <rect width="44" height="30" fill="#fff" />
        {/* Wider than the stroke, so the gap clears it cleanly. */}
        <circle cx="15" cy="15" r="12" stroke="#000" strokeWidth="7.4" />
      </mask>
      <circle
        cx="29"
        cy="15"
        r="12"
        stroke="currentColor"
        strokeWidth="3.4"
        mask={`url(#${maskId})`}
      />
      <circle cx="15" cy="15" r="12" stroke={RING} strokeWidth="3.4" />
    </svg>
  );
}

/** Mark plus wordmark, for headers and footers. */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "font-display text-2xl font-semibold tracking-[-0.03em]",
          wordmarkClassName,
        )}
      >
        WeddlyAI
      </span>
    </span>
  );
}
