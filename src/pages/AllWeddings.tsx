import Page, { PageHeader } from "@/components/Page";
import TablePagination from "@/components/TablePagination";
import ToolBar from "@/components/ToolBar";
import WeddingCard from "@/components/WeddingCard";
import WeddingDialogues from "@/components/WeddingDialogues";
import WeddingPrimaryButtons from "@/components/WeddingPrimaryButtons";
import WeddingProvider from "@/components/WeddingProvider";
import WeddingToolbar from "@/components/WeddingToolbar";
import { useState } from "react";

export default function AllWeddings() {
  const [page, setPage] = useState(1);

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
          <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
            <WeddingCard />
          </div>

          <TablePagination
            page={page}
            totalPages={4}
            totalItems={24}
            pageSize={6}
            onPageChange={setPage}
          />
        </div>
        <WeddingDialogues />
      </Page>
    </WeddingProvider>
  );
}
