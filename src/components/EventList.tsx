import Notice from "@/components/Notice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventsWithStats } from "@/hooks/use-event";
import { RSVP_LEGEND } from "@/lib/rsvpStatus";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { useState } from "react";
import EventCard from "./EventCard";
import { useEvent } from "./EventProvider";
import TablePagination from "./TablePagination";

const PAGE_SIZE = 6;

// Tuned to the width a card actually gets rather than round viewport numbers,
// and written as container queries so collapsing the sidebar re-lays them out.
// A card below ~22rem loses its side-by-side footer buttons, so one column runs
// until there's room for two real ones.
const GRID =
  "grid gap-5 @min-[46rem]/events:grid-cols-2 @min-[80rem]/events:grid-cols-3 @min-[110rem]/events:grid-cols-4";

export default function EventList() {
  const [page, setPage] = useState(1);
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const { setOpen, search, sideFilter, sort, hasFilters, clearFilters } =
    useEvent();

  // A filter change can leave you past the last page of the new result set:
  // start over at page 1. Adjusted during render rather than in an effect.
  const filterKey = `${search}|${sideFilter}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const {
    data: response,
    isLoading,
    isError,
  } = useGetEventsWithStats(
    activeWeddingId,
    page,
    PAGE_SIZE,
    true,
    search,
    sideFilter ?? "",
    sort,
  );

  const data = response?.data;
  const events = data?.events || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalCount || 0;

  // The last event on a page was deleted: step back a page. Adjusted during
  // render instead of in an effect.
  if (!isLoading && !isError && events.length === 0 && page > 1) {
    setPage(page - 1);
  }

  if (!activeWeddingId) {
    return (
      <Notice
        title="No wedding selected."
        body="Pick a wedding from the switcher at the top of the sidebar to see its events."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="@container/events">
        <div className={GRID}>
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="size-11 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-2/5" />
                </div>
              </div>
              <Skeleton className="mt-5 h-8 w-4/5" />
              <div className="mt-5 grid grid-cols-5 gap-3">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-9" />
                ))}
              </div>
              <Skeleton className="mt-5 h-2 w-full" />
              <Skeleton className="mt-5 h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Notice
        title="We couldn't load your events."
        body="Something went wrong on the way to the server. Refresh the page to try again."
      />
    );
  }

  if (events.length === 0 && page === 1 && hasFilters) {
    return (
      <Notice
        title="No events match these filters."
        body="Try a different search term, or widen the side filter."
        action={
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        }
      />
    );
  }

  if (events.length === 0 && page === 1) {
    return (
      <Notice
        title="No events yet."
        body="Add the first event — the mehendi, the sangeet, the wedding itself. Every guest you invite to one gets their own RSVP link for it."
        action={<Button onClick={() => setOpen("add")}>New event</Button>}
      />
    );
  }

  return (
    <div className="@container/events">
      <div className={GRID}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* One legend for every bar on the page, rather than repeating it inside
          each card. Without it the four colours mean nothing. */}
      <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {RSVP_LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${item.dot}`}
            />
            {item.label}
          </span>
        ))}
      </p>

      <TablePagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
