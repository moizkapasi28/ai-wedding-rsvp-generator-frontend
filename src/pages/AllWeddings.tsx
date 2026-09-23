import Page, { PageHeader } from "@/components/Page";
import WeddingDialogues from "@/components/WeddingDialogues";
import WeddingList from "@/components/WeddingList";
import WeddingPrimaryButtons from "@/components/WeddingPrimaryButtons";
import WeddingProvider from "@/components/WeddingProvider";
import WeddingToolbar from "@/components/WeddingToolbar";

export default function AllWeddings() {
  return (
    <WeddingProvider>
      <Page>
        <PageHeader title="Weddings" />

        {/* The action sits above the filters on a phone, where a full-width
            primary button is easier to hit than one squeezed onto a row. */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <WeddingPrimaryButtons />
          <WeddingToolbar />
        </div>

        <div className="mt-6">
          <WeddingList />
        </div>

        <WeddingDialogues />
      </Page>
    </WeddingProvider>
  );
}
