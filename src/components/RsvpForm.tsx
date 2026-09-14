import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DIETARY_OPTIONS } from "@/constants";
import { getEventDisplay, type DisplayEvent } from "@/lib/event-display";
import type {
  RsvpFormat,
  RsvpInvite,
  RsvpReply,
  RsvpStatus,
} from "@/models/rsvp.model";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const REPLY_LABELS: Record<RsvpStatus, string> = {
  ATTENDING: "yes, you'll be there",
  MAYBE: "maybe",
  DECLINED: "you can't make it",
};

type Props = {
  event: DisplayEvent & { title: string; description?: string };
  wedding?: { bride_name: string; groom_name: string };
  format?: RsvpFormat;
  invite?: RsvpInvite;
  closed?: boolean;
  isSubmitting?: boolean;
  onSubmit: (reply: RsvpReply) => void;
};

// Parents key this by event (and saved reply) so the inputs reset from `invite`
export default function RsvpForm({
  event,
  wedding,
  format,
  invite,
  closed = false,
  isSubmitting = false,
  onSubmit,
}: Props) {
  const [plusOnes, setPlusOnes] = useState(invite?.plus_ones ?? 0);
  const [dietary, setDietary] = useState(invite?.dietary ?? "");
  const [songRequest, setSongRequest] = useState(invite?.song_request ?? "");
  const [message, setMessage] = useState(invite?.message ?? "");
  const { names, dateStr, place } = getEventDisplay(event, wedding);
  const disabled = closed || isSubmitting;

  const submit = (status: RsvpStatus) =>
    onSubmit({
      status,
      ...(format?.plus_ones ? { plus_ones: plusOnes } : {}),
      ...(format?.dietary_preference && dietary ? { dietary } : {}),
      ...(format?.song_request && songRequest.trim()
        ? { song_request: songRequest.trim() }
        : {}),
      ...(format?.message && message.trim()
        ? { message: message.trim() }
        : {}),
    });

  return (
    <div className="flex flex-col overflow-hidden rounded-4xl border border-black/10 bg-background shadow-2xl dark:border-white/10">
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 via-purple-600 to-indigo-700 px-6 py-10 text-center text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(255_255_255/0.2),transparent_60%)]" />
        <p className="relative text-[10px] uppercase tracking-[0.15em] text-white/70">
          {[event.title, dateStr].filter(Boolean).join(" · ")}
        </p>
        {names && (
          <h2 className="relative mt-1 font-serif text-3xl leading-tight">
            {names}
          </h2>
        )}
        <p className="relative mt-2 text-xs text-white/80">
          {[place, event.time].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-6">
        {event.description && (
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        )}

        {format?.dietary_preference && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="guest-dietary">Dietary preference</Label>
            <Select
              value={dietary}
              onValueChange={setDietary}
              disabled={disabled}
            >
              <SelectTrigger id="guest-dietary" className="w-full">
                <SelectValue placeholder="Select a preference" />
              </SelectTrigger>
              <SelectContent>
                {DIETARY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {format?.plus_ones && (
          <div className="flex flex-col gap-2">
            <span id="guest-plus-ones" className="text-sm font-medium">
              Plus-ones
            </span>
            <div
              role="group"
              aria-labelledby="guest-plus-ones"
              className="flex h-10 items-center justify-between rounded-md border px-3"
            >
              <button
                type="button"
                aria-label="Decrease plus-ones"
                disabled={disabled || plusOnes === 0}
                onClick={() => setPlusOnes((n) => Math.max(0, n - 1))}
                className="flex size-7 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
              >
                <Minus className="size-3" />
              </button>
              <span
                aria-live="polite"
                className="w-6 text-center text-sm font-semibold"
              >
                {plusOnes}
              </span>
              <button
                type="button"
                aria-label="Increase plus-ones"
                disabled={disabled || plusOnes === 9}
                onClick={() => setPlusOnes((n) => Math.min(9, n + 1))}
                className="flex size-7 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
        )}

        {format?.song_request && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="guest-song">Song request (optional)</Label>
            <Textarea
              id="guest-song"
              placeholder="Any song you'd love to dance to?"
              className="min-h-16 resize-none text-sm"
              maxLength={500}
              value={songRequest}
              onChange={(e) => setSongRequest(e.target.value)}
              disabled={disabled}
            />
          </div>
        )}

        {format?.message && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="guest-message">Message to the couple</Label>
            <Textarea
              id="guest-message"
              placeholder="Leave a note for the couple"
              className="min-h-16 resize-none text-sm"
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
            />
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 border-t pt-6">
          {invite && invite.status !== "PENDING" && (
            <p className="text-center text-sm text-muted-foreground">
              You replied{" "}
              <span className="font-medium text-foreground">
                {REPLY_LABELS[invite.status]}
              </span>
              {closed ? "." : ". You can change your reply below."}
            </p>
          )}
          {closed && (
            <p className="text-center text-sm font-medium text-muted-foreground">
              RSVPs for this event are closed
            </p>
          )}
          <Button
            type="button"
            disabled={disabled}
            onClick={() => submit("ATTENDING")}
            className="h-12 w-full border-0 bg-linear-to-r from-indigo-500 to-purple-600 text-base text-white shadow-md hover:from-indigo-600 hover:to-purple-700"
          >
            Yes, I'll be there!
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              disabled={disabled}
              onClick={() => submit("MAYBE")}
              className="h-10 border-0 bg-amber-500 text-white hover:bg-amber-600"
            >
              Maybe
            </Button>
            <Button
              type="button"
              disabled={disabled}
              onClick={() => submit("DECLINED")}
              className="h-10 border-0 bg-rose-500 text-white hover:bg-rose-600"
            >
              Can't make it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
