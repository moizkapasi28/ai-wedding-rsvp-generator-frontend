import Page, { PageHeader } from "@/components/Page";
import SearchBar from "@/components/SerachBar";
import TablePagination from "@/components/TablePagination";
import ToolBar from "@/components/ToolBar";
import { Button } from "@/components/ui/button";
import WeddingCard from "@/components/WeddingCard";
import { MenuIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function AllWeddings() {
  const [page, setPage] = useState(1);
  return (
    <Page>
      <PageHeader title="All Weddings">
        <Button variant="outline">
          <MenuIcon />
          <span>View as list</span>
        </Button>
        <Button variant="default">
          <PlusIcon />
          <span>New Wedding</span>
        </Button>
      </PageHeader>
      <div className="mt-auto space-y-4">
        <ToolBar>
          <div className="flex flex-wrap gap-3 items-center w-full">
            <div className="flex-1 min-w-60">
              <SearchBar placeholder="Search by couple, city or venue" />
            </div>

            <div className="flex gap-2">
              <Button variant="outline">All</Button>
              <Button variant="outline">This Week</Button>
              <Button variant="outline">Upcoming</Button>
              <Button variant="outline">Completed</Button>
            </div>
          </div>
        </ToolBar>
        <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
    </Page>
  );
}
