import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, SettingsIcon, UsersIcon } from "lucide-react";
import { MultiProgressBar } from "./custom/MultiProgressBar";
import { Button } from "./ui/button";

export default function EventCard() {
  return (
    <Card className="overflow-hidden gap-0 py-0 transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Hero Section */}
      <CardHeader className="relative bg-linear-to-r from-orange-500 to-pink-600 p-5 text-white">
        <div className="absolute right-4 top-4 flex flex-col items-end text-right">
          <span className="text-xs font-medium uppercase">Sat</span>
          <span className="text-sm">16 Dec 2026</span>
        </div>

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
