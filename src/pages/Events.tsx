import EventDialogues from "@/components/EventDialogues";
import EventList from "@/components/EventList";
import EventPrimaryButtons from "@/components/EventPrimaryButtons";
import EventProvider from "@/components/EventProvider";
import EventToolbar from "@/components/EventToolbar";
import Page, { PageHeader } from "@/components/Page";

export default function Events() {
  return (
    <EventProvider>
      <Page>
        {/* The standing "Events & RSVP Management" blurb is gone: the app bar
            already says where you are, and the one fact worth knowing — every
            guest gets their own link per event — now sits in the empty state,
            where someone is actually about to need it. */}
        <PageHeader title="Events" />

        <EventToolbar actions={<EventPrimaryButtons />} />
        <EventList />
        <EventDialogues />
      </Page>
    </EventProvider>
  );
}
