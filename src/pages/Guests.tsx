import GuestPrimaryButtons from "@/components/GuestPrimaryButtons";
import GuestProvider from "@/components/GuestProvider";
import GuestToolbar from "@/components/GuestToolbar";
import Page, { PageHeader } from "@/components/Page";
import ToolBar from "@/components/ToolBar";
import GuestDialogues from "@/components/GuestDialogues";
import GuestList from "@/components/GuestList";

export default function Guests() {
  return (
    <GuestProvider>
      <Page>
        <PageHeader title="Guests" />

        <div className="flex flex-row justify-between items-center gap-4 mb-4 w-full overflow-x-auto pb-2">
          <ToolBar>
            <GuestToolbar />
          </ToolBar>
          <GuestPrimaryButtons />
        </div>
        <GuestList />
        <GuestDialogues />
      </Page>
    </GuestProvider>
  );
}
