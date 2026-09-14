import {
  Card,
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

export default function RsvpProgressCard({ events }: { events: Event[] }) {
  const navigate = useNavigate();

  return (
    <Card className="h-full py-5">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>RSVP Progress by Event</CardTitle>

          <CardDescription>How each function is filling up</CardDescription>
        </div>

        <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
          View all events
        </Button>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No events yet. Add events to start tracking RSVPs.
          </p>
        ) : (
          // Rows are ~2.5rem with 1.5rem gaps: five fit, matching the Recent RSVPs list beside it
          <ScrollFade className="max-h-[18.5rem] space-y-6">
            {events.map((event) => (
              <EventProgressRow key={event.id} event={event} />
            ))}
          </ScrollFade>
        )}
      </CardContent>
    </Card>
  );
}

export function EventProgressRow({ event }: { event: Event }) {
  const { stats } = event;

  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-row flex-wrap gap-x-2">
          <p className="font-medium">{event.title}</p>

          <p className="text-sm text-muted-foreground">
            {new Date(event.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}{" "}
            · {event.venue}
          </p>
        </div>

        <div className="text-sm shrink-0">
          <span className="font-medium">{stats.attendingGuests}</span>
          <span className="text-muted-foreground">
            {" "}
            / {stats.totalGuests} invited
          </span>
        </div>
      </div>

      <MultiProgressBar {...stats.progressBar} />
    </div>
  );
}
