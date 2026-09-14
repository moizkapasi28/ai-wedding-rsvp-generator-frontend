import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LiveStatus } from "@/hooks/use-wedding-live";
import { cn } from "@/lib/utils";
import type { LiveRsvp } from "@/models/wedding.model";

// Colours match MultiProgressBar: green attending, yellow maybe, red declined
const STATUS_STYLES: Record<LiveRsvp["status"], { label: string; className: string }> = {
  ATTENDING: {
    label: "Attending",
    className: "bg-green-500/15 text-green-700 dark:text-green-400",
  },
  MAYBE: {
    label: "Maybe",
    className: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-500/15 text-red-700 dark:text-red-400",
  },
};

const LIVE_LABELS: Record<LiveStatus, string> = {
  connecting: "Connecting…",
  live: "Live",
  reconnecting: "Reconnecting…",
};

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const timeAgo = (iso: string, now: number) => {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  if (seconds > -60) return relativeTime.format(seconds, "second");
  if (seconds > -3600) return relativeTime.format(Math.round(seconds / 60), "minute");
  if (seconds > -86400) return relativeTime.format(Math.round(seconds / 3600), "hour");
  return relativeTime.format(Math.round(seconds / 86400), "day");
};

type Props = {
  rsvps: LiveRsvp[];
  // When the data was fetched; keeps render pure (no Date.now) and times consistent across rows.
  // ponytail: times only move on the next refetch, so "2 minutes ago" can go stale on a quiet page
  now: number;
  liveStatus: LiveStatus;
};

export default function RecentRsvpsCard({ rsvps, now, liveStatus }: Props) {
  const isLive = liveStatus === "live";

  return (
    <Card className="h-full py-5">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Recent RSVPs</CardTitle>
          <CardDescription>Latest replies from your guests</CardDescription>
        </div>

        <span
          role="status"
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              isLive ? "bg-green-500" : "animate-pulse bg-amber-500",
            )}
          />
          {LIVE_LABELS[liveStatus]}
        </span>
      </CardHeader>

      <CardContent className="space-y-1">
        {rsvps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies yet</p>
        ) : (
          rsvps.map((rsvp) => {
            const status = STATUS_STYLES[rsvp.status];
            const isNew = now - new Date(rsvp.respondedAt).getTime() < 60_000;

            return (
              <div
                key={rsvp.inviteId}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors",
                  isNew && "bg-primary/10",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{rsvp.guestName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {rsvp.eventTitle} · {timeAgo(rsvp.respondedAt, now)}
                  </p>
                </div>
                <Badge className={cn("shrink-0", status.className)}>
                  {status.label}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
