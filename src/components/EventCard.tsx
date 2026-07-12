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

export type EventCardData = {
  id: string;
  title: string;
  date: string;
  day: string;
  venue: string;
  eventSide: EventSide;
  stats: {
    invited: string | number;
    attending: string | number;
    declined: string | number;
    pending: string | number;
  };
  completion: number;
  progressBar: {
    confirmed: number;
    maybe: number;
    declined: number;
  };
};

const DEFAULT_EVENT: EventCardData = {
  id: "sangeet-id",
  title: "Sangeet",
  date: "16 Dec 2026",
  day: "Sat",
  venue: "Taj Lands End, Mumbai",
  eventSide: "BOTH",
  stats: {
    invited: "186",
    attending: "90",
    declined: "17",
    pending: "3",
  },
  completion: 65,
  progressBar: {
    confirmed: 50,
    maybe: 10,
    declined: 5,
  },
};

type EventCardProps = {
  event?: EventCardData;
};

const getSideBadgeStyles = (side: EventSide) => {
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

const formatSide = (side: EventSide) => {
  if (side === "BOTH") return "Bride & Groom";
  return side.charAt(0) + side.slice(1).toLowerCase();
};

export default function EventCard({ event = DEFAULT_EVENT }: EventCardProps) {
  const { setOpen } = useEvent();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuActive = menuOpen;

  return (
    <Card className="group overflow-hidden gap-0 py-0 transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Hero Section */}
      <CardHeader className="relative bg-linear-to-r from-orange-500 to-pink-600 p-5 text-white">
        <div
          className={`absolute right-4 top-4 flex flex-col items-end text-right pointer-events-none transition-opacity duration-200 ${menuActive ? "opacity-0" : "group-hover:opacity-0"}`}
        >
          <span className="text-xs font-medium uppercase">{event.day}</span>
          <span className="text-sm">{event.date}</span>
        </div>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              id="wedding-card-options-btn"
              variant="ghost"
              size="icon"
              className={`absolute right-2 top-2 h-7 w-7 text-white hover:bg-white/20 hover:text-white focus-visible:ring-0 transition-opacity duration-200 ${
                menuActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="Wedding options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              id="wedding-card-edit-btn"
              className="cursor-pointer"
              onClick={() => setOpen("edit")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="wedding-card-delete-btn"
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => setOpen("delete")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          <h3 className="text-xl font-semibold">{event.title}</h3>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-5 p-5">
        {/* Venue & Side Badge */}
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{event.venue}</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border transition-colors shrink-0",
              getSideBadgeStyles(event.eventSide),
            )}
          >
            {formatSide(event.eventSide)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={String(event.stats.invited)} label="Invited" />
          <Stat value={String(event.stats.attending)} label="Attending" />
          <Stat value={String(event.stats.declined)} label="Declined" />
          <Stat value={String(event.stats.pending)} label="Pending" />
        </div>

        {/* RSVP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">RSVP Completion</span>

            <span className="font-medium">{event.completion}%</span>
          </div>

          <MultiProgressBar
            confirmed={event.progressBar.confirmed}
            maybe={event.progressBar.maybe}
            declined={event.progressBar.declined}
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
