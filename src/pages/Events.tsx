import EventDialogues from "@/components/EventDialogues";
import EventList from "@/components/EventList";
import EventPrimaryButtons from "@/components/EventPrimaryButtons";
import EventProvider from "@/components/EventProvider";
import Page, { PageHeader } from "@/components/Page";

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
        <EventList />
        <EventDialogues />
      </Page>
    </EventProvider>
  );
}
