import EventLocationCard from "@/components/EventLocationCard";
import EventBar from "@/components/EventBar";
import NoEventsState from "@/components/NoEventsState";
import Notice from "@/components/Notice";
import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { SendInvitesDialogue } from "@/components/SendInvitesDialogue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDueReminders } from "@/hooks/use-guest";
import {
  useGetGuestEventInviteFormatsInfinite,
  useGetViewUrl,
} from "@/hooks/use-pageSetting";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// The three columns answer to the content width, not the viewport, so
// collapsing the sidebar re-lays them out — same split the other event-scoped
// pages use.
const SHELL = "@container/preview";
// The invitation card's 9:16 height sets the row; the RSVP form is set tight
// enough to fit beside it, and it and the location card stretch to match.
const SPLIT = "grid gap-5 @min-[64rem]/preview:grid-cols-3";

export default function GuestPreviewMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  // Plain state, like the other event-scoped pages; the URL stays /guest-preview
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sendOpen, setSendOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetGuestEventInviteFormatsInfinite(activeWeddingId, 5);

  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];
  const selectedEvent =
    events.find((e) => e.id === selectedEventId) ?? events[0];
  const format = selectedEvent?.guestEventInviteFormat?.[0];
  const { data: dueReminders } = useGetDueReminders(selectedEvent?.id);
  const reminderCount = dueReminders?.data.length ?? 0;

  // The event's own card — generated or uploaded on the AI Invite Card page.
  // Stored as an S3 key, so it needs a signed URL before it can be shown.
  const {
    data: cardUrl,
    isLoading: isCardLoading,
    isError: isCardError,
  } = useGetViewUrl(
    selectedEvent?.inviteCard?.[0]?.generated_invite_image_url,
  );

  // The RSVP page's own illustration, the same image Page Settings previews
  const { data: rsvpHeroImage = null } = useGetViewUrl(format?.generated_image);

  if (isLoading) {
    return (
      <div className={SHELL}>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {[24, 32, 28].map((w, i) => (
            <Skeleton
              key={i}
              className="h-8 rounded-lg"
              style={{ width: w * 4 }}
            />
          ))}
          <Skeleton className="ml-auto h-8 w-52 rounded-lg" />
        </div>
        <div className={SPLIT}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="aspect-[9/16] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Notice
        title="We couldn't load this preview."
        body="Something went wrong on the way to the server. Refresh the page to try again."
      />
    );
  }

  if (!selectedEvent) {
    return (
      <NoEventsState description="Create an event to preview what your guests will see." />
    );
  }

  return (
    <div className={SHELL}>
      <EventBar
        events={events}
        selectedId={selectedEvent.id}
        onSelect={setSelectedEventId}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      >
        <Button className="shrink-0" onClick={() => setSendOpen(true)}>
          <Send />
          {/* The full label needs room; on a narrow screen the icon and the
              count still say what the button does. */}
          <span className="hidden @min-[26rem]/eventbar:inline">
            Send RSVPs on WhatsApp
          </span>
          {reminderCount > 0 && (
            <span className="rounded-full bg-primary-foreground/20 px-2 text-xs tabular-nums">
              {reminderCount} due
            </span>
          )}
        </Button>
      </EventBar>

      <SendInvitesDialogue
        eventId={selectedEvent.id}
        eventTitle={selectedEvent.title}
        remindersEnabled={!!(format?.first_reminder || format?.final_reminder)}
        open={sendOpen}
        onOpenChange={setSendOpen}
      />

      <p className="mb-5 text-sm text-muted-foreground">
        What a guest sees when they open their link. Replies made here don't
        count — this is a preview.
      </p>

      {/* Keyed by event so form inputs reset on switch */}
      <div key={selectedEvent.id} className={SPLIT}>
        {/* The artwork is the one thing on this page worth looking at, so it
            gets square corners and a hairline instead of the rounded, blurred
            slab it used to float in — a printed invitation has square corners,
            and rounding clipped the design's own.

            self-start keeps it at its own 9:16 shape instead of stretching to
            the row; the other two columns stretch to match it. */}
        <div className="relative aspect-[9/16] w-full self-start overflow-hidden border border-border bg-muted/30">
          {cardUrl ? (
            <img
              src={cardUrl}
              alt={`${selectedEvent.title} invitation card`}
              className="absolute inset-0 size-full object-contain"
            />
          ) : isCardLoading ? (
            <Skeleton className="absolute inset-0 rounded-none" />
          ) : (
            // No stock image standing in: a sample here read as the couple's
            // own invitation, which is the one thing a preview can't get wrong.
            <div className="flex size-full flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-medium">
                {isCardError
                  ? "We couldn't load the invitation card."
                  : "No invitation card yet."}
              </p>
              <p className="mt-1 max-w-[28ch] text-sm text-muted-foreground">
                {isCardError
                  ? "Refresh the page to try again."
                  : "Generate one or upload your own, and it shows up here."}
              </p>
              {!isCardError && (
                <Button asChild variant="outline" size="sm" className="mt-5">
                  {/* In navigation state, not the URL: it opens on this event
                      and the address stays /invite-card */}
                  <Link to="/invite-card" state={{ eventId: selectedEvent.id }}>
                    Create invitation card
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* The same component as Page Settings' Live preview, fed the saved
            settings, so the two previews of the RSVP card can't differ */}
        <RsvpPhonePreview
          event={selectedEvent}
          heroImage={rsvpHeroImage}
          dietaryPreference={!!format?.dietary_preference}
          plusOnesEnabled={!!format?.plus_ones}
          songRequest={!!format?.song_request}
          messageToCouple={!!format?.message}
        />

        <EventLocationCard event={selectedEvent} />
      </div>
    </div>
  );
}
