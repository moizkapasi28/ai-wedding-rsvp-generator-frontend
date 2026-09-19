import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  value: number;
  label: string;
  badge?: string;
};

export default function DashboardStatsCard({ Icon, value, label, badge }: Props) {
  return (
    <Card className="overflow-hidden gap-0 py-0 hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader className="bg-primary space-y-1 relative p-4">
        {badge && (
          <span className="absolute right-6 top-6 bg-none text-primary-foreground">
            {badge}
          </span>
        )}

        <Icon
          className="text-primary-foreground  p-1 rounded-md bg-white/20"
          size={40}
        />
      </CardHeader>

      <CardContent className="p-5">
        <p className="text-base font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
