import { Skeleton } from "@/components/ui/skeleton";
import type { Guest } from "@/models/guest.model";
import { EventInviteBadges, GroupLabel, SideBadge } from "./GuestFields";
import GuestActionsCell from "./GuestActionsCell";

/**
 * The narrow-screen rendering of the same rows the table shows. Seven columns
 * can't survive a phone — the old page just scrolled sideways with the row menu
 * pinned to the edge, which hid the RSVP badges that are the point of the page.
 */
export default function GuestCardList({
  guests,
  isLoading,
}: {
  guests: Guest[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <ul className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-3 h-6 w-2/3" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-3">
      {guests.map((guest) => (
        <li
          key={guest.id}
          className="min-w-0 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{guest.name}</p>
              {/* Own lines: sharing one truncated both into uselessness at
                  phone width, and the number is what chases an RSVP. */}
              <p className="mt-0.5 truncate text-sm tabular-nums text-muted-foreground">
                {guest.mobile_number}
              </p>
              {guest.email && (
                <p
                  className="truncate text-sm text-muted-foreground"
                  title={guest.email}
                >
                  {guest.email}
                </p>
              )}
            </div>
            <SideBadge side={guest.side} />
            <div className="-mt-1 -mr-2 shrink-0">
              <GuestActionsCell guest={guest} />
            </div>
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-2">
            <GroupLabel group={guest.group} />
          </div>

          <EventInviteBadges
            invites={guest.guestEventInvite}
            className="mt-3 w-full"
          />
        </li>
      ))}
    </ul>
  );
}
