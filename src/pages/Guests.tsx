import GuestDialogues from "@/components/GuestDialogues";
import GuestList from "@/components/GuestList";
import GuestPrimaryButtons from "@/components/GuestPrimaryButtons";
import GuestProvider from "@/components/GuestProvider";
import GuestToolbar from "@/components/GuestToolbar";
import Page, { PageHeader } from "@/components/Page";

export default function Guests() {
  return (
    <GuestProvider>
      <Page>
        <PageHeader title="Guests" />

        <GuestToolbar actions={<GuestPrimaryButtons />} />
        <GuestList />
        <GuestDialogues />
      </Page>
    </GuestProvider>
  );
}
