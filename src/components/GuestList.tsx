import Notice from "@/components/Notice";
import { RSVP_LEGEND } from "@/lib/rsvpStatus";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { useGetGuests } from "@/hooks/use-guest";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { DataTable } from "./guests/data-table";
import GuestCardList from "./guests/GuestCardList";
import { columns } from "./guests/columns";
import { useGuest } from "./GuestProvider";

const PAGE_SIZE = 10;

// Seven columns need about 950px before they stop being a sideways scroll, so
// the table only appears once the content area is that wide. Below it the same
// rows render as cards. A container query, not a media query: collapsing the
// sidebar changes how much room this list gets without the viewport moving.
// Written out in full because Tailwind scans for whole class strings — a
// concatenated prefix never reaches the generated CSS.
const CARDS_ONLY = "@min-[60rem]/guests:hidden";
const TABLE_ONLY = "hidden @min-[60rem]/guests:block";

export default function GuestList() {
  const [page, setPage] = useState(1);
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const {
    search,
    eventFilter,
    sideFilter,
    groupFilter,
    sentFilter,
    clearFilters,
    hasFilters,
    setOpen,
  } = useGuest();

  // Back to page 1 when the filters change (adjusted during render, not in an effect)
  const filterKey = JSON.stringify([
    search,
    eventFilter,
    sideFilter,
    groupFilter,
    sentFilter,
  ]);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const {
    data: queryData,
    isLoading,
    error,
  } = useGetGuests(
    activeWeddingId,
    page,
    PAGE_SIZE,
    search,
    eventFilter,
    sideFilter,
    groupFilter,
    sentFilter ?? undefined,
  );

  const guests = queryData?.data?.guests || [];
  const totalPages = queryData?.data?.totalPages || 1;
  const totalCount = queryData?.data?.totalCount || 0;

  // The last guest on a page was deleted: step back a page
  if (!isLoading && !error && guests.length === 0 && page > 1) {
    setPage(page - 1);
  }

  if (error) {
    return (
      <Notice
        title="We couldn't load your guests."
        body="Something went wrong on the way to the server. Refresh the page to try again."
      />
    );
  }

  if (!isLoading && guests.length === 0 && page === 1) {
    // A filter that found nothing is a different situation from having no
    // guests at all, and needs a different way out.
    return hasFilters ? (
      <Notice
        title="No guests match that."
        body="No guest matches your search and filters. Try a different name, event or side."
        action={
          <Button variant="outline" onClick={clearFilters}>
            Clear search and filters
          </Button>
        }
      />
    ) : (
      <Notice
        title="No guests yet."
        body="Add your first guest, or import the whole list from a spreadsheet."
        action={<Button onClick={() => setOpen("add")}>Add guest</Button>}
      />
    );
  }

  return (
    <div className="@container/guests">
      <div className={CARDS_ONLY}>
        <GuestCardList guests={guests} isLoading={isLoading} />
      </div>
      <div className={TABLE_ONLY}>
        <DataTable columns={columns} data={guests} isLoading={isLoading} />
      </div>

      {/* An event badge's colour is its RSVP status, which is unreadable
          without this — the same gap the dashboard progress bar had. */}
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {RSVP_LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span aria-hidden className={`size-2 shrink-0 rounded-full ${item.dot}`} />
            {item.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full border border-dashed border-muted-foreground"
          />
          Invite not sent yet
        </span>
      </p>

      <TablePagination
        page={page}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
