import EventLocationCard from "@/components/EventLocationCard";
import RsvpForm from "@/components/RsvpForm";
import Loader from "@/components/ui/loader";
import { useGetRsvp, useSubmitRsvp } from "@/hooks/use-rsvp";
import { useParams } from "react-router-dom";

export default function Rsvp() {
  const { token = "" } = useParams();
  const { data, isLoading, isError } = useGetRsvp(token);
  const submitRsvp = useSubmitRsvp(token);

  if (isLoading) return <Loader />;

  const rsvp = data?.data;

  if (isError || !rsvp) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">
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
  const closed =
    !!event.invite.invite_deadline &&
    new Date(event.invite.invite_deadline) < new Date();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-1 text-center">
          <p className="text-sm text-muted-foreground">
            Hi {guest.name}, you're invited to celebrate
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">
            {wedding.bride_name} &amp; {wedding.groom_name}
          </h1>
        </header>

        <div className="grid gap-6 xl:grid-cols-2">
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
