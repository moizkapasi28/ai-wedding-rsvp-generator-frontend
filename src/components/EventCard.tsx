import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  MapPin,
  MoreVertical,
  Pencil,
  SettingsIcon,
  Trash2,
  UsersIcon,
  Clock,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { MultiProgressBar } from "./custom/MultiProgressBar";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EventSide } from "@/validations/event.validation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvent } from "./EventProvider";
import type { Event } from "@/models/event.model";

type EventCardProps = {
  event: Event;
};

export const getSideBadgeStyles = (side: EventSide) => {
  switch (side) {
    case "BRIDE":
      return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/50";
    case "GROOM":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/50";
    case "BOTH":
    default:
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50";
  }
};

export const formatSide = (side: EventSide) => {
  if (side === "BOTH") return "Bride & Groom";
  return side.charAt(0) + side.slice(1).toLowerCase();
};

export default function EventCard({ event }: EventCardProps) {
  const { setOpen, setCurrentRow } = useEvent();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuActive = menuOpen;

  return (
    <Card className="group flex flex-col h-full overflow-hidden gap-0 py-0 transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Hero Section */}
      <CardHeader className="relative bg-linear-to-r from-orange-500 to-pink-600 p-5 text-white">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              id="wedding-card-options-btn"
              variant="ghost"
              size="icon"
              className={`absolute right-2 top-2 h-8 w-8 text-white hover:bg-white/20 hover:text-white focus-visible:ring-0 transition-opacity duration-200 ${menuActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              aria-label="Wedding options"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              id="wedding-card-edit-btn"
              className="cursor-pointer"
              onClick={() => {
                setCurrentRow(event);
                setOpen("edit");
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="wedding-card-delete-btn"
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                setCurrentRow(event);
                setOpen("delete");
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="pr-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">
            {event.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium opacity-90">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-5 p-5 flex-1 flex flex-col min-h-0">
        {/* Venue & Side Badge */}
        <div className="flex items-start justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-foreground/70" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="font-semibold text-foreground truncate">
                {event.venue}
              </span>
              {event.address && (
                <span className="text-xs truncate" title={event.address}>
                  {event.address}
                </span>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
              getSideBadgeStyles(event.event_side),
            )}
          >
            {formatSide(event.event_side)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mt-auto pt-1">
          <Stat value={String(event.stats.totalGuests)} label="Invited" />
          <Stat value={String(event.stats.attendingGuests)} label="Attending" />
          <Stat value={String(event.stats.declinedGuests)} label="Declined" />
          <Stat value={String(event.stats.maybeGuests)} label="Maybe" />
          <Stat value={String(event.stats.pendingGuests)} label="Pending" />
        </div>

        {/* RSVP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">RSVP Completion</span>

            <span className="font-medium">{event.stats.completion}%</span>
          </div>

          <MultiProgressBar
            confirmed={event.stats.progressBar.confirmed}
            maybe={event.stats.progressBar.maybe}
            declined={event.stats.progressBar.declined}
            pending={event.stats.progressBar.pending}
          />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-5 pb-5 pt-0 border-t-0 bg-transparent">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1 p-2">
            <SettingsIcon />
            <span>RSVP Settings</span>
          </Button>

          <Button variant="outline" className="flex-1 p-2">
            <UsersIcon />
            <span>Guest List</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

/* Small reusable pieces (this is where real cleanliness comes from) */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-base font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
