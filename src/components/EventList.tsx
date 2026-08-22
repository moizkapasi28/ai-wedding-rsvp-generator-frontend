import { useGetEventsWithStats } from "@/hooks/use-event";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import TablePagination from "./TablePagination";

import { Skeleton } from "@/components/ui/skeleton";

export default function EventList() {
  const [page, setPage] = useState(1);
  const [activeWeddingid] = useAtom(activeWeddingIdAtom);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetEventsWithStats(activeWeddingid, page, 6, true);

  if (!activeWeddingid) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Please select a wedding to view its events.
      </div>
    );
  }

  const data = response?.data;
  const events = data?.events || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalCount || 0;

  useEffect(() => {
    if (!isLoading && !isError && events.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [isLoading, isError, events.length, page]);

  if (isLoading) {
    return (
      <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load events. Please try again.
      </div>
    );
  }

  if (events.length === 0 && page === 1) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No events found.
      </div>
    );
  }

  return (
    <>
      <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {totalPages > 0 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={6}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
