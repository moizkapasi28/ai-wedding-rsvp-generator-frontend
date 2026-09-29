import ScrollFade from "@/components/custom/ScrollFade";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LiveStatus } from "@/hooks/use-wedding-live";
import { cn } from "@/lib/utils";
import { rsvpStatus } from "@/lib/rsvpStatus";
import type { LiveRsvp } from "@/models/wedding.model";

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
  const visibleRows = Math.min(rsvps.length, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent RSVPs</CardTitle>
        <CardDescription>Latest replies from your guests</CardDescription>
        <CardAction>
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
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {rsvps.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No replies yet. They'll appear here the moment a guest responds.
          </p>
        ) : (
          // Absolutely positioned so the list fills whatever height the row gives the card (set by the
          // progress card beside it) without stretching the row itself. The min height is up to five
          // rows (h-14 with 0.25rem gaps), so a short list never pads the row; older replies scroll
          <div
            className="relative flex-1"
            style={{ minHeight: `${visibleRows * 3.5 + (visibleRows - 1) * 0.25}rem` }}
          >
          <ScrollFade className="absolute inset-0 space-y-1">
          {rsvps.map((rsvp) => {
            const status = rsvpStatus(rsvp.status);
            const isNew = now - new Date(rsvp.respondedAt).getTime() < 60_000;

            return (
              <div
                key={rsvp.inviteId}
                className={cn(
                  "flex h-14 items-center justify-between gap-3 rounded-md px-2 transition-colors",
                  isNew && "bg-primary/10",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{rsvp.guestName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {rsvp.eventTitle} · {timeAgo(rsvp.respondedAt, now)}
                  </p>
                </div>
                <Badge className={cn("shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium", status.className)}>
                  {status.label}
                </Badge>
              </div>
            );
          })}
          </ScrollFade>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
