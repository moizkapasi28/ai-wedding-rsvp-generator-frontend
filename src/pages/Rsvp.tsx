import EventLocationCard from "@/components/EventLocationCard";
import RsvpForm from "@/components/RsvpForm";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useGetRsvp, useSubmitRsvp } from "@/hooks/use-rsvp";
import { Navigate, useParams } from "react-router-dom";

export default function Rsvp() {
  const { slug, token = "" } = useParams();
  const { data, isLoading, isError } = useGetRsvp(token);
  const submitRsvp = useSubmitRsvp(token);

  if (isLoading) return <Loader />;

  const rsvp = data?.data;

  if (isError || !rsvp) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 font-display text-2xl font-medium tracking-[-0.02em]">
          This invitation link isn't valid
        </h1>
        <p className="text-muted-foreground">
          Please check the link you received, or ask the couple to send it
          again.
        </p>
      </main>
    );
  }

  const { guest, wedding, event } = rsvp;

  // Old /rsvp/:token links, or ones sent before the wedding was renamed, land on the current slug
  // (a title with no a-z/0-9 characters has an empty slug; the backend uses the same fallback)
  const canonicalSlug = wedding.slug || "invite";
  if (slug !== canonicalSlug) {
    return <Navigate to={`/rsvp/${canonicalSlug}/${token}`} replace />;
  }
  const closed =
    !!event.invite.invite_deadline &&
    new Date(event.invite.invite_deadline) < new Date();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:py-12">
      <div
        className={cn(
          "mx-auto space-y-6",
          event.invite_card_url ? "max-w-7xl" : "max-w-5xl",
        )}
      >
        {/* The invitation below carries the couple's names in the display face.
            Printing them again here, in a second typeface, said the same thing
            twice in two voices. What only this line can say is who it was sent
            to — so that's all it says now. It stays the h1: small type, but
            still the page's heading. */}
        <header className="text-center">
          <h1 className="text-sm text-muted-foreground">
            Hi {guest.name}, you're invited to celebrate
          </h1>
        </header>

        <div
          className={cn(
            "grid gap-6",
            event.invite_card_url ? "xl:grid-cols-3" : "xl:grid-cols-2",
          )}
        >
          {/* The invitation itself, first: it's what the guest opened the link
              to see. Same frame as Guest Preview — square, hairline, its own
              9:16 shape — and capped on phones and tablets, where full width
              would make it taller than two screens. */}
          {event.invite_card_url && (
            <div className="relative mx-auto aspect-[9/16] w-full max-w-sm self-start overflow-hidden border border-border bg-muted/30 xl:max-w-none">
              <img
                src={event.invite_card_url}
                alt={`${event.title} invitation card`}
                className="absolute inset-0 size-full object-contain"
              />
            </div>
          )}

          {/* Keyed by the saved reply so the form resets to it after each submit */}
          <RsvpForm
            key={event.invite.responded_at ?? "unanswered"}
            event={event}
            wedding={wedding}
            format={event.format}
            invite={event.invite}
            closed={closed}
            isSubmitting={submitRsvp.isPending}
            onSubmit={(reply) => submitRsvp.mutate(reply)}
          />
          <EventLocationCard event={event} />
        </div>
      </div>
    </main>
  );
}
