import { Button } from "@/components/ui/button";
import {
  formatSide,
  getSideBadgeStyles,
  getSideSelectedStyles,
} from "@/lib/eventSide";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  events: { id: string; title: string; event_side: string }[];
  selectedId: string;
  onSelect: (eventId: string) => void;
  children?: ReactNode;
};

/**
 * The row of events you can switch between. Two things at once, one colour
 * system: the hue is whose side the event is, the fill is whether it's the one
 * you're looking at.
 */
export default function EventSwitcher({
  events,
  selectedId,
  onSelect,
  children,
}: Props) {
  return (
    // Scrolls sideways rather than wrapping into a growing pile of pills that
    // pushes the page down. -mx-1/px-1 keeps focus rings visible.
    <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5">
      {events.map((event) => {
        const isSelected = selectedId === event.id;
        return (
          <Button
            key={event.id}
            size="sm"
            variant="outline"
            aria-pressed={isSelected}
            title={`${event.title} — ${formatSide(event.event_side)}`}
            className={cn(
              "shrink-0",
              isSelected
                ? getSideSelectedStyles(event.event_side)
                : getSideBadgeStyles(event.event_side),
            )}
            onClick={() => onSelect(event.id)}
          >
            {event.title}
          </Button>
        );
      })}
      {children}
    </div>
  );
}
