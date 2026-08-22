import DashboardStatsCard from "@/components/DashboardStatsCard";
import DietaryBreakDownCard from "@/components/DietaryBreakDownCard";
import Page, { PageHeader } from "@/components/Page";
import ResponseStatsCard from "@/components/ResponseStatsCard";
import RsvpProgressCard from "@/components/RsvpProgressCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Simulated loading state - replace with real data fetching hook later
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Page>
      <PageHeader title="Wedding Dashboard" />
      
      {isLoading ? (
        <div className="mt-auto space-y-4">
          {/* Stats Cards Skeleton */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>

          {/* Graphs Row 1 Skeleton */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>

          {/* Graphs Row 2 Skeleton */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DashboardStatsCard />
            <DashboardStatsCard />
            <DashboardStatsCard />
            <DashboardStatsCard />
          </div>

          {/* Graphs Row 1 */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RsvpProgressCard />
            </div>
            <div className="lg:col-span-1">
              <DietaryBreakDownCard />
            </div>
          </div>

          {/* Graphs Row 2 */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ResponseStatsCard />
            </div>
            <div className="lg:col-span-1">
              <DietaryBreakDownCard />
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
