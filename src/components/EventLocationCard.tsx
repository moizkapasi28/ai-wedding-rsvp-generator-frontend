import { Button } from "@/components/ui/button";
import { getEventDisplay, type DisplayEvent } from "@/lib/event-display";
import { MapPin } from "lucide-react";

export default function EventLocationCard({ event }: { event: DisplayEvent }) {
  const { place, when, mapQuery } = getEventDisplay(event);

  return (
    <div className="flex flex-col gap-6 rounded-4xl border border-black/10 bg-background/70 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 dark:border-white/10">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl">When &amp; Where</h2>
        {when && <p className="text-sm font-medium">{when}</p>}
        {place && (
          <p className="font-serif italic text-foreground/80">{place}</p>
        )}
        {event.address && (
          <p className="text-sm text-muted-foreground">{event.address}</p>
        )}
      </div>

      {mapQuery ? (
        <>
          <div className="relative h-80 overflow-hidden rounded-2xl border xl:h-auto xl:min-h-80 xl:flex-1">
            <iframe
              title={`Map of ${place || mapQuery}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>
          <Button asChild variant="outline">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Get directions
            </a>
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          No venue added for this event yet.
        </p>
      )}
    </div>
  );
}
