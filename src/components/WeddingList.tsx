import { useGetWeddingsWithStats } from "@/hooks/use-wedding";
import { useEffect, useState } from "react";
import TablePagination from "./TablePagination";
import WeddingCard from "./WeddingCard";
import { useWedding } from "./WeddingProvider";

import { Skeleton } from "@/components/ui/skeleton";

export default function WeddingList() {
  const [page, setPage] = useState(1);
  const { search, filter, sortBy, sortOrder } = useWedding();
  const {
    data: response,
    isLoading,
    isError,
  } = useGetWeddingsWithStats(page, 6, true, search, filter, sortBy, sortOrder);

  const data = response?.data;
  const weddings = data?.weddings || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalCount || 0;

  useEffect(() => {
    if (!isLoading && !isError && weddings.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [isLoading, isError, weddings.length, page]);

  // Reset page when search, filter or sort changes
  useEffect(() => {
    setPage(1);
  }, [search, filter, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-4 p-6 border rounded-xl bg-card">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex justify-between pt-4 mt-auto">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load weddings. Please try again.
      </div>
    );
  }

  if (weddings.length === 0 && page === 1) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No weddings found.
      </div>
    );
  }

  return (
    <>
      <div className="mt-auto grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {weddings.map((wedding) => (
          <WeddingCard key={wedding.id} wedding={wedding} />
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
