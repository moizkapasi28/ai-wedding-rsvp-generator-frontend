import EventSwitcher from "@/components/EventSwitcher";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  events: { id: string; title: string; event_side: string }[];
  selectedId: string;
  onSelect: (eventId: string) => void;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  /** The page's action for the selected event, e.g. Save changes */
  children?: React.ReactNode;
};

/**
 * Which event you're working on, and the one action that goes with it — shared
 * by the RSVP page settings, the invite card builder and the guest preview,
 * which each had their own copy of this.
 *
 * Sticky, because all three pages are taller than a screen and the action used
 * to scroll away. It declares its own container so it lays itself out by its
 * own width, whatever the page around it is called.
 */
export default function EventBar({
  events,
  selectedId,
  onSelect,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  children,
}: Props) {
  return (
    <div className="@container/eventbar sticky top-14 z-20 -mx-4 mb-5 border-b border-border bg-background px-4 py-3 sm:-mx-6 sm:px-6">
      {/* One row at every width. A second row for a single button wastes the
          height a phone hasn't got, so the action shrinks to its icon instead
          and the events keep the rest. */}
      <div className="flex items-center gap-2 @min-[26rem]/eventbar:gap-3">
        <EventSwitcher events={events} selectedId={selectedId} onSelect={onSelect}>
          {hasNextPage && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="shrink-0"
              onClick={() => fetchNextPage?.()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage && <Loader2 className="animate-spin" />}
              Load more
            </Button>
          )}
        </EventSwitcher>

        {children && (
          <div className="flex shrink-0 items-center justify-end gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
