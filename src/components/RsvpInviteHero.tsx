import { cn } from "@/lib/utils";

/**
 * The top of the invitation, shared by the real RSVP form and the preview in
 * page settings — the two used to carry the same design copied into both files,
 * which is how they drift.
 *
 * It was an indigo→purple gradient slab with a radial highlight, a tracked-out
 * all-caps eyebrow and a serif name. It's set like stationery now: square
 * edges, a short centred rule above and below, the couple carried by the
 * display face, and no colour except the illustration itself.
 */
export default function RsvpInviteHero({
  names,
  eventTitle,
  date,
  place,
  time,
  image,
  className,
}: {
  names?: string;
  eventTitle?: string;
  date?: string;
  place?: string;
  time?: string;
  image?: string | null;
  className?: string;
}) {
  const occasion = [eventTitle, date].filter(Boolean).join(", ");
  const where = [place, time].filter(Boolean).join(" · ");

  return (
    <div
      className={cn(
        "flex flex-col items-center border-b border-border px-6 py-10 text-center",
        className,
      )}
    >
      {image && (
        // Square, like a mounted photograph on a card, not a social avatar
        <img
          src={image}
          alt=""
          className="mb-7 size-28 shrink-0 border border-border object-cover"
        />
      )}

      {occasion && (
        <>
          <Rule />
          <p className="px-2 py-3 text-xs text-muted-foreground">{occasion}</p>
        </>
      )}

      {names && (
        <h2 className="font-display text-[2rem] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
          {names}
        </h2>
      )}

      {where && (
        <>
          <p className="px-2 pt-3 pb-3 text-xs text-muted-foreground">
            {where}
          </p>
          <Rule />
        </>
      )}
    </div>
  );
}

/** A short centred hairline — the rule an engraved invitation sets its type between. */
function Rule() {
  // --border is 10% at this theme, which disappears at 40px wide
  return <span aria-hidden className="h-px w-10 bg-foreground/25" />;
}
