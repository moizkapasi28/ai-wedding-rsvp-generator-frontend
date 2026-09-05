import { getSideBadgeStyles } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, Loader2 } from "lucide-react";

interface EventSelectorBarProps {
  events: any[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  isUploadingReference: boolean;
  isUploadingCharacter: boolean;
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
}: EventSelectorBarProps) {
  if (events.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
      <div className="flex flex-wrap gap-2 w-full">
        {events.map((event: any) => {
          const sideStyles = getSideBadgeStyles(event.event_side as any);
          const isSelected = selectedEventId === event.id;

          return (
            <Button
              key={event.id}
              variant="outline"
              className={cn(
                "rounded-full transition-all duration-200",
                sideStyles,
                isSelected
                  ? "ring-1 ring-current border-transparent opacity-100 font-semibold shadow-sm"
                  : "opacity-70 hover:opacity-100",
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
            variant="outline"
            className="rounded-full"
            onClick={(e) => {
              e.preventDefault();
              fetchNextPage();
            }}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            View More
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="default"
          onClick={onGenerate}
          disabled={isGenerating || !selectedEventId || isUploadingReference || isUploadingCharacter}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckIcon className="mr-2 h-4 w-4" />
          )}
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
}
