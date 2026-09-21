import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { rsvpStatus } from "@/lib/rsvpStatus";

/**
 * The three replies, shared by the real RSVP form and the preview.
 *
 * They used to be a gradient "Yes, I'll be there!", a solid amber Maybe and a
 * solid rose Can't make it — three saturated blocks competing for the same
 * moment. Now the accept is the only filled button and the other two are quiet,
 * each carrying the status dot that means the same thing everywhere else in the
 * app: green attending, yellow maybe, red declined. Square, like everything
 * else on the card — a rounded pill inside a printed invitation reads as UI.
 */
const REPLIES = [
  { status: "ATTENDING", label: "Yes, I'll be there" },
  { status: "MAYBE", label: "Maybe" },
  { status: "DECLINED", label: "Can't make it" },
] as const;

export default function RsvpReplyButtons({
  onReply,
  disabled,
  className,
}: {
  onReply?: (status: "ATTENDING" | "MAYBE" | "DECLINED") => void;
  disabled?: boolean;
  className?: string;
}) {
  const [accept, ...rest] = REPLIES;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => onReply?.(accept.status)}
        className="h-11 w-full rounded-none"
      >
        <span
          aria-hidden
          className={`size-2 rounded-full ${rsvpStatus(accept.status).dot}`}
        />
        {accept.label}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        {rest.map((reply) => (
          <Button
            key={reply.status}
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onReply?.(reply.status)}
            className="h-10 min-w-0 rounded-none"
          >
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${rsvpStatus(reply.status).dot}`}
            />
            <span className="truncate">{reply.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
