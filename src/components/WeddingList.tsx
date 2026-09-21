import Notice from "@/components/Notice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWeddingsWithStats } from "@/hooks/use-wedding";
import { useState } from "react";
import TablePagination from "./TablePagination";
import WeddingCard from "./WeddingCard";
import { useWedding } from "./WeddingProvider";

const PAGE_SIZE = 6;

// Breakpoints are tuned to the width the cards actually get (viewport minus
// the sidebar), not to round viewport numbers, so no screen size lands on a
// cramped or stretched card. Measured card widths stay between ~315 and ~590px
// from a 375px phone to a 2560px display:
//   <700  1 col   700-1535  2 cols   1536-2099  3 cols   2100+  4 cols
// sm:grid-cols-2 was the problem at 640-700, where the sidebar is still a
// drawer and two columns left only ~286px each.
// All three are arbitrary on purpose: mixing a named breakpoint (2xl) with
// arbitrary ones emits them out of order, and 2xl:grid-cols-3 then beat
// min-[2100px]:grid-cols-4 on a 2100px screen.
const GRID =
  "grid gap-5 min-[700px]:grid-cols-2 min-[1536px]:grid-cols-3 min-[2100px]:grid-cols-4";

export default function WeddingList() {
  const [page, setPage] = useState(1);
  const { search, filter, sortBy, sortOrder, setSearch, setFilter, setOpen } =
    useWedding();

  // Back to page 1 when search, filter or sort changes (adjusted during render, not in an effect)
  const filterKey = JSON.stringify([search, filter, sortBy, sortOrder]);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const {
    data: response,
    isLoading,
    isError,
  } = useGetWeddingsWithStats(
    page,
    PAGE_SIZE,
    true,
    search,
    filter,
    sortBy,
    sortOrder,
  );

  const data = response?.data;
  const weddings = data?.weddings || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalCount || 0;

  // The last wedding on a page was deleted: step back a page
  if (!isLoading && !isError && weddings.length === 0 && page > 1) {
    setPage(page - 1);
  }

  if (isLoading) {
    return (
      <div className={GRID}>
        {[...Array(PAGE_SIZE)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="space-y-5 p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="size-10 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-2/5" />
                </div>
              </div>
              <Skeleton className="h-8 w-4/5" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Notice
        title="We couldn't load your weddings."
        body="Something went wrong on the way to the server. Refresh the page to try again."
      />
    );
  }

  if (weddings.length === 0 && page === 1) {
    // A search that found nothing is a different situation from having no
    // weddings at all, and needs a different way out.
    const isFiltered = Boolean(search) || filter.length > 0;

    return isFiltered ? (
      <Notice
        title="Nothing matches that."
        body="No wedding matches your search and filters. Try a different name, city or venue."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setFilter([]);
            }}
          >
            Clear search and filters
          </Button>
        }
      />
    ) : (
      <Notice
        title="No weddings yet."
        body="Create your first wedding, add its ceremonies, and start inviting guests."
        action={<Button onClick={() => setOpen("add")}>New wedding</Button>}
      />
    );
  }

  return (
    <>
      <div className={GRID}>
        {weddings.map((wedding) => (
          <WeddingCard key={wedding.id} wedding={wedding} />
        ))}
      </div>
      {totalPages > 0 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
