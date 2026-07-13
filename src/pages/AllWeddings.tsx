import Page, { PageHeader } from "@/components/Page";
import ToolBar from "@/components/ToolBar";
import WeddingDialogues from "@/components/WeddingDialogues";
import WeddingList from "@/components/WeddingList";
import WeddingPrimaryButtons from "@/components/WeddingPrimaryButtons";
import WeddingProvider from "@/components/WeddingProvider";
import WeddingToolbar from "@/components/WeddingToolbar";

export default function AllWeddings() {
  return (
    <WeddingProvider>
      <Page>
        <PageHeader title="All Weddings" />

        <div className="mt-auto space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <ToolBar>
              <WeddingToolbar />
            </ToolBar>

            <WeddingPrimaryButtons />
          </div>

          <WeddingList />
        </div>
        <WeddingDialogues />
      </Page>
    </WeddingProvider>
  );
}
