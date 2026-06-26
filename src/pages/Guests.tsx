import Page, { PageHeader } from "@/components/Page";
import SearchBar from "@/components/SerachBar";
import ToolBar from "@/components/ToolBar";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { type Guest, columns } from "../components/guests/columns";
import { DataTable } from "../components/guests/data-table";
import TablePagination from "@/components/TablePagination";
import { useState } from "react";

const staticData: Guest[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Attending",
    dietaryRequirements: "None",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Pending",
    dietaryRequirements: "Vegetarian",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Declined",
    dietaryRequirements: "None",
  },
];

export default function Guests() {
  const [page, setPage] = useState(1);
  return (
    <Page>
      <PageHeader title="Guests" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <ToolBar>
          <div className="flex flex-wrap gap-3 items-center w-full">
            <div className="flex-1 min-w-60">
              <SearchBar placeholder="Search by name or phone...." />
            </div>

            <div className="flex gap-2">
              <Button variant="outline">All</Button>
              <Button variant="outline">This Week</Button>
              <Button variant="outline">Upcoming</Button>
              <Button variant="outline">Completed</Button>
            </div>
          </div>
        </ToolBar>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline">
            <DownloadIcon />
            <span>Export CSV</span>
          </Button>
          <Button variant="default">
            <PlusIcon />
            <span>Add Guest</span>
          </Button>
        </div>
      </div>

      <div className="mt-auto">
        <DataTable columns={columns} data={staticData} />
      </div>

      <div className="mt-4">
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
