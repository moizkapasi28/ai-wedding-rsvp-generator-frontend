import EventLocationCard from "@/components/EventLocationCard";
import EventSwitcher from "@/components/EventSwitcher";
import NoEventsState from "@/components/NoEventsState";
import RsvpForm from "@/components/RsvpForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGuestEventInviteFormatsInfinite } from "@/hooks/use-pageSetting";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { Loader2, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function GuestPreviewMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetGuestEventInviteFormatsInfinite(activeWeddingId, 5);

  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];
  const eventParam = searchParams.get("event");
  const selectedEvent = events.find((e) => e.id === eventParam) ?? events[0];
  const format = selectedEvent?.guestEventInviteFormat?.[0];

  // ponytail: static card for now; swap to useGetViewUrl(format?.generated_image) when generated cards are ready
  const cardImage = "/test-preview.jpeg";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
        <div className="mx-auto grid w-full max-w-md gap-6 xl:max-w-400 xl:grid-cols-3">
          <Skeleton className="h-160 w-full rounded-4xl" />
          <Skeleton className="h-160 w-full rounded-4xl" />
          <Skeleton className="h-160 w-full rounded-4xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="mb-2 text-xl font-bold">Couldn't load preview</h2>
        <p className="text-muted-foreground">
          Something went wrong while loading your events. Please try again.
        </p>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <NoEventsState description="Create an event to preview what your guests will see." />
    );
  }

  const handleSelectEvent = (eventId: string) => {
    setSearchParams(
      (prev) => {
        prev.set("event", eventId);
        return prev;
      },
      { replace: true },
    );
  };

  return (
    <>
      {/* Event selection & actions */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <EventSwitcher
          events={events}
          selectedId={selectedEvent.id}
          onSelect={handleSelectEvent}
        >
          {hasNextPage && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              View More
            </Button>
          )}
        </EventSwitcher>

        {/* No bulk-send API exists yet, so keep it visibly inactive */}
        <Button className="shrink-0" disabled>
          <Send className="mr-2 h-4 w-4" />
          Send RSVP in Bulk
        </Button>
      </div>

      {/* Guest-facing preview. Keyed by event so form inputs reset on switch. */}
      <div
        key={selectedEvent.id}
        className="relative isolate overflow-hidden rounded-4xl border bg-background p-4 shadow-sm sm:p-6 lg:p-10"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={cardImage}
            alt=""
            className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-3xl"
          />
          <div className="absolute inset-0 bg-background/50" />
        </div>

        {/* Equal-width columns; rows stretch so all three cards share one height */}
        <div className="mx-auto grid max-w-md grid-cols-1 gap-6 xl:max-w-400 xl:auto-rows-[minmax(40rem,auto)] xl:grid-cols-3 xl:gap-10">
          {/* Invitation card: image is absolute so it fills the row instead of sizing it */}
          <div className="relative aspect-9/16 w-full overflow-hidden rounded-4xl border border-black/10 bg-muted shadow-2xl xl:aspect-auto dark:border-white/10">
            <img
              src={cardImage}
              alt={`${selectedEvent.title} invitation card`}
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          {/* Preview only: submitting does nothing */}
          <RsvpForm
            event={selectedEvent}
            wedding={selectedEvent.wedding}
            format={format}
            onSubmit={() => {}}
          />

          <EventLocationCard event={selectedEvent} />
        </div>
      </div>
    </>
  );
}
