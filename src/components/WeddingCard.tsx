import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

export default function WeddingCard() {
  return (
    <Card className="overflow-hidden gap-0 py-0 hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Header (Hero section) */}
      <CardHeader className="bg-linear-to-r from-orange-500 to-pink-600 text-white space-y-1 relative p-5">
        <Badge className="absolute right-3 top-3 bg-white/20 text-white hover:bg-white/20">
          This Week
        </Badge>

        <h3 className="text-lg font-semibold">Tanvi & Aditya</h3>

        <p className="text-sm text-white/80">16 Jun 2026 · Mumbai</p>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 space-y-5">
        {/* Venue */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Taj Lands End</span>
        </div>

        {/* Stats (grid is unavoidable in CSS) */}
        <div className="grid grid-cols-3 text-left">
          <Stat value="186" label="Guests" />
          <Stat value="3" label="Events" />
          <Stat value="94%" label="Confirmed" />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 pb-5 px-4 ">
        <ProgressBar value={94} />
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

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-linear-to-r from-orange-500 to-pink-600"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
