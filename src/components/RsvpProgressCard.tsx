import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/models/event.model";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { MultiProgressBar } from "./custom/MultiProgressBar";
import ScrollFade from "./custom/ScrollFade";

// Same four colours the bar paints, in the same order.
const LEGEND = [
  { label: "Attending", className: "bg-green-500" },
  { label: "Maybe", className: "bg-yellow-500" },
  { label: "Declined", className: "bg-red-500" },
  { label: "Pending", className: "bg-violet-500" },
];

export default function RsvpProgressCard({ events }: { events: Event[] }) {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>RSVP progress by event</CardTitle>
        <CardDescription>How each function is filling up</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
            View all events
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No events yet. Add a ceremony to start tracking RSVPs.
          </p>
        ) : (
          <>
            {/* Rows are ~2.5rem with 1.5rem gaps: five fit, matching the Recent RSVPs list beside it */}
            <ScrollFade className="max-h-[18.5rem] space-y-6">
              {events.map((event) => (
                <EventProgressRow key={event.id} event={event} />
              ))}
            </ScrollFade>

            {/* Without this the four colours in the bar mean nothing */}
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              {LEGEND.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className={`size-2 shrink-0 rounded-full ${item.className}`}
                  />
                  {item.label}
                </span>
              ))}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EventProgressRow({ event }: { event: Event }) {
  const { stats } = event;

  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate font-medium">{event.title}</p>
        <p className="shrink-0 text-sm tabular-nums">
          {stats.attendingGuests}
          <span className="text-muted-foreground">
            {" / "}
            {stats.totalGuests}
          </span>
        </p>
      </div>

      <p className="mt-0.5 mb-2 truncate text-xs text-muted-foreground">
        {new Date(event.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })}
        {event.venue ? ` · ${event.venue}` : ""}
      </p>

      <MultiProgressBar {...stats.progressBar} />
    </div>
  );
}
