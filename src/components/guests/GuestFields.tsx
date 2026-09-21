import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { rsvpStatus } from "@/lib/rsvpStatus";
import type { GuestEventInvite } from "@/models/guest.model";
import { formatSide, getSideBadgeStyles } from "@/lib/eventSide";

// The pieces of a guest that the table and the card list both render, so the
// two views can't drift apart.

const BADGE = "rounded-md border px-2 py-0.5 text-xs font-medium";

export function SideBadge({ side }: { side: string }) {
  return (
    <Badge className={cn(BADGE, "shrink-0", getSideBadgeStyles(side))}>
      {formatSide(side)}
    </Badge>
  );
}

/** Sentence case, no colour — a group is a category, not a state. */
export function GroupLabel({ group }: { group?: string | null }) {
  const value = group || "OTHER";
  return (
    <span className="text-sm text-muted-foreground">
      {value === "VIP" ? "VIP" : value.charAt(0) + value.slice(1).toLowerCase()}
    </span>
  );
}

export function EventInviteBadges({
  invites,
  className,
}: {
  invites: GuestEventInvite[];
  className?: string;
}) {
  if (invites.length === 0) {
    return <span className="text-sm text-muted-foreground">No events</span>;
  }

  return (
    // Capped width in the table so badges wrap onto new lines instead of
    // widening the column; the card passes its own width.
    <div className={cn("flex flex-wrap gap-1", className ?? "max-w-56")}>
      {invites.map((invite) => {
        const status = rsvpStatus(invite.status);
        const sent = Boolean(invite.invite_sent_at);

        return (
          <Badge
            key={invite.id}
            title={`${invite.event.title} — ${status.label}, ${sent ? "invite sent" : "invite not sent yet"}`}
            className={cn(
              BADGE,
              "shrink-0 gap-1.5",
              status.className,
              // Dashed edge marks an invite not sent yet without a second badge
              !sent && "border-dashed",
            )}
          >
            <span aria-hidden className={cn("size-1.5 rounded-full", status.dot)} />
            {invite.event.title}
          </Badge>
        );
      })}
    </div>
  );
}
