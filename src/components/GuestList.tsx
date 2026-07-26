import TablePagination from "@/components/TablePagination";
import { useGetGuests } from "@/hooks/use-guest";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtom } from "jotai";
import { useState } from "react";
import { DataTable } from "../components/guests/data-table";
import { columns } from "./guests/columns";
import { useGuest } from "./GuestProvider";

export default function GuestList() {
  const [page, setPage] = useState(1);
  const [activeWeddingid] = useAtom(activeWeddingIdAtom);
  const { search, eventFilter, sideFilter, groupFilter } = useGuest();

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetGuests(
    activeWeddingid,
    page,
    6,
    search,
    eventFilter,
    sideFilter,
    groupFilter,
  );

  const guests = queryData?.data?.guests || [];
  const totalPages = queryData?.data?.totalPages || 1;
  const totalCount = queryData?.data?.totalCount || 0;

  return (
    <>
      <div className="mt-auto">
        <DataTable
          columns={columns}
          data={guests}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="mt-4">
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={6}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
