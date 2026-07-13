import { useGetWeddingsWithStats } from "@/hooks/use-wedding";
import { useState } from "react";
import TablePagination from "./TablePagination";
import WeddingCard from "./WeddingCard";

export default function WeddingList() {
  const [page, setPage] = useState(1);
  const {
    data: response,
    isLoading,
    isError,
  } = useGetWeddingsWithStats(page, 6, true);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading weddings...
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

  const data = response?.data;
  const weddings = data?.weddings || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalCount || 0;

  if (weddings.length === 0) {
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
