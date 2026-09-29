import EventCard from "@/components/EventCard";
import EventProvider from "@/components/EventProvider";
import { sampleEvents } from "@/components/landing/sampleData";

export default function CeremoniesSection() {
  return (
    <section id="ceremonies" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            One wedding, four guest lists.
          </h2>
          <p className="mt-6 max-w-[42ch] leading-relaxed text-muted-foreground">
            Each ceremony carries its own date, time, venue and map pin, and
            its own list of people. A guest asked to the Sangeet but not the
            Haldi only ever sees the Sangeet, and replies to it on its own. Four
            functions, four counts, one dashboard.
          </p>
        </div>

        {/* Full width, like the Events page itself, so the cards get the
            room they do in the app. */}
        <div className="mt-14 lg:mt-20">
          {/* The Events page's own cards, two across (its wider three- and
              four-column steps would leave the fourth card alone on a row). EventCard reads
              the dialog state from EventProvider, so it gets one; inert means
              its menu and buttons never open anything here. */}
          <EventProvider>
            <div inert className="@container/events">
              <div className="grid gap-5 @min-[46rem]/events:grid-cols-2">
                {sampleEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </EventProvider>
        </div>
      </div>
    </section>
  );
}
