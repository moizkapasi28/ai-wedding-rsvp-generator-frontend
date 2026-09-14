import GuestPrimaryButtons from "@/components/GuestPrimaryButtons";
import GuestProvider from "@/components/GuestProvider";
import GuestToolbar from "@/components/GuestToolbar";
import Page, { PageHeader } from "@/components/Page";
import GuestDialogues from "@/components/GuestDialogues";
import GuestList from "@/components/GuestList";

export default function Guests() {
  return (
    <GuestProvider>
      <Page>
        <PageHeader title="Guests" />

        {/* One row when it fits; wraps instead of scrolling sideways on narrow screens */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <GuestToolbar />
          <GuestPrimaryButtons />
        </div>
        <GuestList />
        <GuestDialogues />
      </Page>
    </GuestProvider>
  );
}
