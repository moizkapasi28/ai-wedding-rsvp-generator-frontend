import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIETARY_OPTIONS } from "@/constants";
import { useMarkInviteSent } from "@/hooks/use-guest";
import { useSubmitGuestRsvp } from "@/hooks/use-rsvp";
import { copyRsvpLink } from "@/lib/rsvp-link";
import { cn } from "@/lib/utils";
import type { GuestEventInvite, WhatsAppInvite } from "@/models/guest.model";
import type { RsvpStatus } from "@/models/rsvp.model";
import { CalendarDays, Link2, MapPin, Send } from "lucide-react";

// One colour per reply, used for the card's edge and the dot in the status dropdown
const STATUS_STYLES: Record<string, { label: string; dot: string; edge: string }> = {
  ATTENDING: { label: "Attending", dot: "bg-emerald-500", edge: "border-l-emerald-500" },
  MAYBE: { label: "Maybe", dot: "bg-amber-500", edge: "border-l-amber-500" },
  DECLINED: { label: "Declined", dot: "bg-rose-500", edge: "border-l-rose-500" },
  PENDING: { label: "Awaiting reply", dot: "bg-muted-foreground/40", edge: "border-l-border" },
};

const REPLY_OPTIONS: RsvpStatus[] = ["ATTENDING", "MAYBE", "DECLINED"];

const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });

type GuestInviteCardProps = {
  invite: GuestEventInvite;
  // RSVP + WhatsApp links from the backend; undefined while they load
  links?: WhatsAppInvite;
};

export default function GuestInviteCard({ invite, links }: GuestInviteCardProps) {
  const markSent = useMarkInviteSent();
  const submitRsvp = useSubmitGuestRsvp();

  const { event } = invite;
  const status = STATUS_STYLES[invite.status] ?? STATUS_STYLES.PENDING;
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const dietary =
    DIETARY_OPTIONS.find((option) => option.value === invite.dietary)?.label ??
    invite.dietary;
  const hasReply =
    !!invite.plus_ones || !!dietary || !!invite.song_request || !!invite.message;

  const lastReminder =
    invite.final_reminder_sent_at ?? invite.first_reminder_sent_at;
  const activity = invite.responded_at
    ? `Replied ${formatDate(invite.responded_at)}`
    : lastReminder
      ? `Reminder sent ${formatDate(lastReminder)}`
      : invite.invite_sent_at
      ? `Invite sent ${formatDate(invite.invite_sent_at)}`
      : "Invite not sent yet";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-l-4 bg-card",
        status.edge,
      )}
    >
      <div className="flex flex-col gap-4 p-4">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-base font-semibold">{event.title}</h3>
            {event.date && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                {/* Event dates are stored as calendar dates, so read them in UTC */}
                {formatDate(event.date, { weekday: "short", timeZone: "UTC" })}
                {event.time && ` at ${event.time}`}
              </p>
            )}
            {place && (
              <p
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
                title={event.address}
              >
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{place}</span>
              </p>
            )}
          </div>

          {/* Lets the host set the reply for guests who couldn't use their link */}
          <Select
            value={invite.status === "PENDING" ? "" : invite.status}
            onValueChange={(value) =>
              submitRsvp.mutate({
                inviteId: invite.id,
                reply: { status: value as RsvpStatus },
              })
            }
            disabled={submitRsvp.isPending}
          >
            <SelectTrigger
              size="sm"
              className="shrink-0 text-xs"
              aria-label={`RSVP status for ${event.title}`}
            >
              <SelectValue placeholder="Awaiting reply" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              {REPLY_OPTIONS.map((value) => (
                <SelectItem key={value} value={value} className="text-xs">
                  <span
                    className={cn("size-2 rounded-full", STATUS_STYLES[value].dot)}
                  />
                  {STATUS_STYLES[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        {event.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        {hasReply && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-muted/50 p-3 text-sm">
            {!!invite.plus_ones && (
              <div>
                <dt className="text-xs text-muted-foreground">Plus-ones</dt>
                <dd className="font-medium">{invite.plus_ones}</dd>
              </div>
            )}
            {dietary && (
              <div>
                <dt className="text-xs text-muted-foreground">Dietary</dt>
                <dd className="font-medium">{dietary}</dd>
              </div>
            )}
            {invite.song_request && (
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Song request</dt>
                <dd className="break-words">{invite.song_request}</dd>
              </div>
            )}
            {invite.message && (
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Message</dt>
                <dd className="whitespace-pre-wrap break-words">{invite.message}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t px-4 py-3">
        <div className="text-xs">
          <p className="text-muted-foreground">{activity}</p>
          {!invite.responded_at && invite.invite_deadline && (
            <p className="text-amber-600 dark:text-amber-400">
              Reply by {formatDate(invite.invite_deadline)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {links?.whatsapp_url ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={links.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                onClick={() => markSent.mutate(invite.id)}
              >
                <Send />
                {invite.invite_sent_at ? "Resend on WhatsApp" : "Send on WhatsApp"}
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              title={links ? "Add a valid mobile number to send on WhatsApp" : undefined}
            >
              <Send />
              Send on WhatsApp
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!links}
            onClick={() => links && copyRsvpLink(links.rsvp_url)}
            aria-label="Copy RSVP link"
            title="Copy RSVP link"
          >
            <Link2 />
          </Button>
        </div>
      </footer>
    </article>
  );
}
