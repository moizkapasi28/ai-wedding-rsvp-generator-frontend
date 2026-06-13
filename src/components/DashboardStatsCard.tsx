import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function DashboardStatsCard() {
  return (
    <Card className="overflow-hidden gap-0 py-0 hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Header (Hero section) */}
      <CardHeader className="bg-primary space-y-1 relative p-4">
        <span className="absolute right-6 top-6 bg-none text-primary-foreground">
          12 this week
        </span>

        {/* Icon */}
        <Users
          className="text-primary-foreground  p-1 rounded-md bg-white/20 "
          size={40}
        />
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-3 text-left">
          <Stat value="186" label="Guests invited" />
        </div>
      </CardContent>
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
