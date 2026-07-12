import EventCard, { type EventCardData } from "@/components/EventCard";
import EventDialogues from "@/components/EventDialogues";
import EventPrimaryButtons from "@/components/EventPrimaryButtons";
import EventProvider from "@/components/EventProvider";
import Page, { PageHeader } from "@/components/Page";

const MOCK_EVENTS: EventCardData[] = [
  {
    id: "event-1",
    title: "Mehendi",
    date: "14 Dec 2026",
    day: "Thu",
    venue: "Lotus Banquet Hall, Mumbai",
    eventSide: "BRIDE",
    stats: {
      invited: 120,
      attending: 85,
      declined: 15,
      pending: 20,
    },
    completion: 83,
    progressBar: {
      confirmed: 70,
      maybe: 13,
      declined: 17,
    },
  },
  {
    id: "event-2",
    title: "Sangeet",
    date: "15 Dec 2026",
    day: "Fri",
    venue: "Taj Lands End, Mumbai",
    eventSide: "BOTH",
    stats: {
      invited: 186,
      attending: 120,
      declined: 16,
      pending: 50,
    },
    completion: 73,
    progressBar: {
      confirmed: 64,
      maybe: 9,
      declined: 27,
    },
  },
  {
    id: "event-3",
    title: "Haldi",
    date: "16 Dec 2026",
    day: "Sat",
    venue: "Groom's Residence Lawn, Mumbai",
    eventSide: "GROOM",
    stats: {
      invited: 80,
      attending: 60,
      declined: 5,
      pending: 15,
    },
    completion: 81,
    progressBar: {
      confirmed: 75,
      maybe: 6,
      declined: 19,
    },
  },
  {
    id: "event-4",
    title: "Wedding Ceremony",
    date: "16 Dec 2026",
    day: "Sat",
    venue: "Taj Lands End, Mumbai",
    eventSide: "BOTH",
    stats: {
      invited: 250,
      attending: 190,
      declined: 20,
      pending: 40,
    },
    completion: 84,
    progressBar: {
      confirmed: 76,
      maybe: 8,
      declined: 16,
    },
  },
  {
    id: "event-5",
    title: "Reception",
    date: "17 Dec 2026",
    day: "Sun",
    venue: "The St. Regis, Mumbai",
    eventSide: "BOTH",
    stats: {
      invited: 300,
      attending: 210,
      declined: 30,
      pending: 60,
    },
    completion: 80,
    progressBar: {
      confirmed: 70,
      maybe: 10,
      declined: 20,
    },
  },
];

export default function Events() {
  return (
    <EventProvider>
      <Page>
        <PageHeader title="Events" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              Events & RSVP Management
            </span>
            <span className="font-light text-xs">
              Each guest gets a unique RSVP link per event they are invited to
            </span>
          </div>

          <EventPrimaryButtons />
        </div>
        <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
          {MOCK_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <EventDialogues />
      </Page>
    </EventProvider>
  );
}
