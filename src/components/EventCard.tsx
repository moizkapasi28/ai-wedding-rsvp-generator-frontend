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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvent } from "./EventProvider";

export default function EventCard() {
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
          <span className="text-xs font-medium uppercase">Sat</span>
          <span className="text-sm">16 Dec 2026</span>
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
          <h3 className="text-xl font-semibold">Sangeet</h3>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-5 p-5">
        {/* Venue */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>Taj Lands End, Mumbai</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value="186" label="Invited" />
          <Stat value="90" label="Attending" />
          <Stat value="17" label="Declined" />
          <Stat value="3" label="Pending" />
        </div>

        {/* RSVP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">RSVP Completion</span>

            <span className="font-medium">65%</span>
          </div>

          <MultiProgressBar confirmed={50} maybe={10} declined={5} />
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
