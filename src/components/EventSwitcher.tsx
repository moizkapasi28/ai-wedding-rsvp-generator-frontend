import { getSideBadgeStyles } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventSide } from "@/validations/event.validation";
import type { ReactNode } from "react";

type Props = {
  events: { id: string; title: string; event_side: string }[];
  selectedId: string;
  onSelect: (eventId: string) => void;
  children?: ReactNode;
};

export default function EventSwitcher({
  events,
  selectedId,
  onSelect,
  children,
}: Props) {
  return (
    <div className="flex w-full flex-wrap gap-2">
      {events.map((event) => {
        const isSelected = selectedId === event.id;
        return (
          <Button
            key={event.id}
            variant="outline"
            aria-pressed={isSelected}
            className={cn(
              "rounded-full transition-all duration-200",
              getSideBadgeStyles(event.event_side as EventSide),
              isSelected
                ? "border-transparent font-semibold shadow-sm ring-1 ring-current"
                : "opacity-70 hover:opacity-100",
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
