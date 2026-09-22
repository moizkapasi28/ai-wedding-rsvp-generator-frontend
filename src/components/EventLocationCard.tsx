import { Button } from "@/components/ui/button";
import { getEventDisplay, type DisplayEvent } from "@/lib/event-display";
import { MapPin } from "lucide-react";

/**
 * Where the event is, set to match the invitation beside it: square edges, a
 * hairline border and the display face — not the rounded, shadowed glass panel
 * it was, which read as app chrome on a page guests open.
 */
export default function EventLocationCard({ event }: { event: DisplayEvent }) {
  const { place, when, mapQuery } = getEventDisplay(event);

  return (
    <div className="flex flex-col border border-border bg-background">
      {/* Same centred header block as the top of the invitation */}
      <div className="flex flex-col items-center border-b border-border px-6 py-8 text-center">
        <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">
          When and where
        </h2>
        {when && <p className="mt-3 text-sm font-medium">{when}</p>}
        {place && <p className="mt-1 text-sm">{place}</p>}
        {event.address && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {event.address}
          </p>
        )}
      </div>

      {mapQuery ? (
        <>
          {/* At least 18rem, and fills whatever height is left when the card
              is stretched beside the invitation. (h-72 + min-h-0 + flex-1 let
              the map collapse to nothing when stacked on a phone.) */}
          <div className="relative min-h-72 flex-1 border-b border-border">
            <iframe
              title={`Map of ${place || mapQuery}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>

          <div className="p-5">
            <Button asChild variant="outline" className="w-full rounded-none">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin />
                Get directions
              </a>
            </Button>
          </div>
        </>
      ) : (
        <p className="px-6 py-8 text-center text-sm text-muted-foreground">
          The couple hasn't added a venue for this event yet.
        </p>
      )}
    </div>
  );
}
