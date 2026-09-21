import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatSide, getSideBadgeStyles } from "@/lib/eventSide";
import type { Event } from "@/models/event.model";
import { MapPin, MoreVertical, Pencil, SettingsIcon, Trash2, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MultiProgressBar } from "./custom/MultiProgressBar";
import { useEvent } from "./EventProvider";
import { Button } from "./ui/button";

export default function EventCard({ event }: { event: Event }) {
  const { setOpen, setCurrentRow } = useEvent();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const when = new Date(event.date);
  const valid = !Number.isNaN(when.getTime());
  const day = valid
    ? {
        number: when.toLocaleDateString("en-GB", {
          day: "numeric",
          timeZone: "UTC",
        }),
        month: when.toLocaleDateString("en-GB", {
          month: "short",
          timeZone: "UTC",
        }),
      }
    : { number: "—", month: "" };

  // Year is noise for this year's events and essential for any other.
  const year =
    valid && when.getUTCFullYear() !== new Date().getFullYear()
      ? String(when.getUTCFullYear())
      : null;
  const meta = [year, event.time].filter(Boolean).join(" · ") || "Time not set";

  return (
    // Hairline card, no gradient slab. The date block replaces the old colour
    // wash: it's the same size but it carries the one thing a ceremony is
    // organised around.
    <article className="@container/event flex min-w-0 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-ring">
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-muted leading-none"
        >
          <span className="font-display text-base font-medium tracking-[-0.02em] tabular-nums">
            {day.number}
          </span>
          <span className="mt-0.5 text-[0.625rem] text-muted-foreground">
            {day.month}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="line-clamp-2 text-base font-semibold tracking-[-0.02em]"
            title={event.title}
          >
            {event.title}
          </h3>
          {/* The block beside it already says the day and month, so this line
              only carries what's left: the time, and the year when it isn't
              this one. Repeating the full date here truncated the time away on
              a phone. */}
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {meta}
          </p>
        </div>

        <Badge
          className={cn(
            "mt-0.5 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium",
            getSideBadgeStyles(event.event_side),
          )}
        >
          {formatSide(event.event_side)}
        </Badge>

        {/* Always visible. It used to fade in on hover, which meant no way to
            reach Edit or Delete on a touch screen at all. */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mt-1 -mr-2 shrink-0 text-muted-foreground"
              aria-label={`Options for ${event.title}`}
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setCurrentRow(event);
                setOpen("edit");
              }}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                setCurrentRow(event);
                setOpen("delete");
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex min-w-0 items-start gap-2 border-t border-border pt-4 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate">{event.venue || "Venue not set"}</p>
          {event.address && (
            <p
              className="truncate text-xs text-muted-foreground"
              title={event.address}
            >
              {event.address}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-x-3 gap-y-4 @min-[22rem]/event:grid-cols-5">
        <Stat value={event.stats.totalGuests} label="Invited" />
        <Stat value={event.stats.attendingGuests} label="Attending" />
        <Stat value={event.stats.maybeGuests} label="Maybe" />
        <Stat value={event.stats.declinedGuests} label="Declined" />
        <Stat value={event.stats.pendingGuests} label="Pending" />
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Replied</span>
        <span className="font-medium tabular-nums">
          {event.stats.completion}%
        </span>
      </div>
      <div className="mt-2">
        <MultiProgressBar {...event.stats.progressBar} />
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4 @min-[20rem]/event:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate(`/guests?event=${event.id}`)}
        >
          <UsersIcon />
          Guest list
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate(`/page-settings?event=${event.id}`)}
        >
          <SettingsIcon />
          RSVP page
        </Button>
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0">
      <dd className="font-display text-xl font-medium tracking-[-0.02em] tabular-nums">
        {value}
      </dd>
      <dt className="mt-0.5 truncate text-xs text-muted-foreground">{label}</dt>
    </div>
  );
}
