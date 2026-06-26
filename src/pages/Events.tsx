import EventCard from "@/components/EventCard";
import Page, { PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Events() {
  return (
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

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="default">
            <PlusIcon />
            <span>Add Event</span>
          </Button>
        </div>
      </div>
      <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2 ">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </Page>
  );
}
