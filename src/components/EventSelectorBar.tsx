import { Button } from "@/components/ui/button";
import {
  formatSide,
  getSideBadgeStyles,
  getSideSelectedStyles,
} from "@/lib/eventSide";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface EventSelectorBarProps {
  // Only the fields the bar renders, so any event-shaped list fits
  events: { id: string; title: string; event_side: string }[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  isUploadingReference: boolean;
  isUploadingCharacter: boolean;
  isDirty: boolean;
}

export default function EventSelectorBar({
  events,
  selectedEventId,
  setSelectedEventId,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isGenerating,
  onGenerate,
  isUploadingReference,
  isUploadingCharacter,
  isDirty,
}: EventSelectorBarProps) {
  if (events.length === 0) return null;

  return (
    // Which event you're designing for, and the one button that commits it.
    // Sticky, because the form below is long enough to scroll past.
    <div className="sticky top-14 z-20 -mx-4 mb-5 border-b border-border bg-background px-4 py-3 sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Scrolls sideways rather than wrapping into a growing pile of pills
            that pushes the form down the page. */}
        <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5">
          {/* Two things at once, one colour system: the hue is whose side the
              event is, the fill is whether it's the one you're editing. */}
          {events.map((event) => {
            const isSelected = selectedEventId === event.id;
            return (
              <Button
                key={event.id}
                size="sm"
                variant="outline"
                type="button"
                aria-pressed={isSelected}
                title={`${event.title} — ${formatSide(event.event_side)}`}
                className={cn(
                  "shrink-0",
                  isSelected
                    ? getSideSelectedStyles(event.event_side)
                    : getSideBadgeStyles(event.event_side),
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedEventId(event.id);
                }}
              >
                {event.title}
              </Button>
            );
          })}
          {hasNextPage && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
                fetchNextPage();
              }}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage && <Loader2 className="animate-spin" />}
              Load more
            </Button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Says out loud that switching events would lose the edits */}
          <span
            className={cn(
              "hidden text-xs text-muted-foreground @min-[34rem]/invite:inline",
              !isDirty && "invisible",
            )}
          >
            Unsaved changes
          </span>
          <Button
            type="button"
            onClick={onGenerate}
            loading={isGenerating}
            disabled={
              !selectedEventId || isUploadingReference || isUploadingCharacter
            }
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
