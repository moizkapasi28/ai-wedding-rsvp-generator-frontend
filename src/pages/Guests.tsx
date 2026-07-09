import GuestPrimaryButtons from "@/components/GuestPrimaryButtons";
import GuestProvider from "@/components/GuestProvider";
import GuestToolbar from "@/components/GuestToolbar";
import Page, { PageHeader } from "@/components/Page";
import TablePagination from "@/components/TablePagination";
import ToolBar from "@/components/ToolBar";
import { useState } from "react";
import { type Guest, columns } from "../components/guests/columns";
import { DataTable } from "../components/guests/data-table";
import GuestDialogues from "@/components/GuestDialogues";

const staticData: Guest[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    mobile_number: "9876543210",
    side: "GROOM",
    events: ["Mehendi", "Sangeet", "Wedding Ceremony", "Reception"],
    status: "Attending",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    mobile_number: "9123456780",
    side: "BRIDE",
    events: ["Mehendi", "Wedding Ceremony"],
    status: "Pending",
  },
  {
    id: "3",
    name: "Aisha Khan",
    email: "aisha@example.com",
    mobile_number: "9001234567",
    side: "BRIDE",
    events: ["Sangeet", "Reception"],
    status: "Attending",
  },
  {
    id: "4",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    mobile_number: "9988776655",
    side: "GROOM",
    events: ["Wedding Ceremony", "Reception"],
    status: "Declined",
  },
  {
    id: "5",
    name: "Priya Sharma",
    email: "priya@example.com",
    mobile_number: "9456123780",
    side: "BRIDE",
    events: ["Mehendi", "Sangeet", "Reception"],
    status: "Attending",
  },
  {
    id: "6",
    name: "Arjun Nair",
    email: "arjun@example.com",
    mobile_number: "9345678901",
    side: "GROOM",
    events: ["Reception"],
    status: "Pending",
  },
];

export default function Guests() {
  const [page, setPage] = useState(1);
  return (
    <GuestProvider>
      <Page>
        <PageHeader title="Guests" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <ToolBar>
            <GuestToolbar />
          </ToolBar>

          <GuestPrimaryButtons />
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
        <GuestDialogues />
      </Page>
    </GuestProvider>
  );
}
