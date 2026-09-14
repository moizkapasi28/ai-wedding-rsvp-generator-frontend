import DashboardStatsCard from "@/components/DashboardStatsCard";
import DietaryBreakDownCard from "@/components/DietaryBreakDownCard";
import { formatSide } from "@/components/EventCard";
import Page, { PageHeader } from "@/components/Page";
import RecentRsvpsCard from "@/components/RecentRsvpsCard";
import ResponseStatsCard from "@/components/ResponseStatsCard";
import RsvpProgressCard from "@/components/RsvpProgressCard";
import { Skeleton } from "@/components/ui/skeleton";
import { DIETARY_OPTIONS } from "@/constants";
import { useWeddingLive } from "@/hooks/use-wedding-live";
import { useGetWeddingDashboard } from "@/hooks/use-wedding";
import { activeWeddingIdAtom } from "@/store/store";
import type { EventSide } from "@/validations/event.validation";
import { useAtomValue } from "jotai";
import {
  BedDoubleIcon,
  CheckCircle2Icon,
  HourglassIcon,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const weddingId = useAtomValue(activeWeddingIdAtom);
  const { data, dataUpdatedAt, isLoading, isError } =
    useGetWeddingDashboard(weddingId);
  const liveStatus = useWeddingLive(weddingId);
  const dashboard = data?.data;

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

          {/* Graphs Skeleton */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : isError || !dashboard ? (
        <p className="py-20 text-center text-muted-foreground">
          Couldn't load the dashboard. Please try again later.
        </p>
      ) : (
        <div className="mt-auto space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DashboardStatsCard
              Icon={Users}
              value={dashboard.stats.totalGuests}
              label="Guests invited"
              badge={`${dashboard.stats.guestsThisWeek} this week`}
            />
            <DashboardStatsCard
              Icon={CheckCircle2Icon}
              value={dashboard.stats.attending}
              label="Attending RSVPs"
              badge={`${dashboard.stats.confirmationRate}% confirmed`}
            />
            <DashboardStatsCard
              Icon={HourglassIcon}
              value={dashboard.stats.pending}
              label="Awaiting response"
              badge={`${dashboard.stats.responsesThisWeek} replies this week`}
            />
            <DashboardStatsCard
              Icon={BedDoubleIcon}
              value={dashboard.stats.accommodationRequired}
              label="Need accommodation"
            />
          </div>

          {/* Row 1: live parts above the fold */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RsvpProgressCard events={dashboard.events} />
            </div>
            <div className="lg:col-span-1">
              <RecentRsvpsCard
                rsvps={dashboard.recentRsvps}
                now={dataUpdatedAt}
                liveStatus={liveStatus}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
            <ResponseStatsCard data={dashboard.dailyResponses} />
            <DietaryBreakDownCard
              title="Dietary breakdown"
              description="Meal preferences of attending RSVPs"
              data={dashboard.dietary.map(({ dietary, count }) => ({
                name: dietary,
                label:
                  DIETARY_OPTIONS.find((option) => option.value === dietary)
                    ?.label ?? dietary,
                value: count,
              }))}
            />
            <DietaryBreakDownCard
              title="Guests by side"
              description="Who's coming from which family"
              data={dashboard.sides.map(({ side, count }) => ({
                name: side,
                label: formatSide(side as EventSide),
                value: count,
              }))}
            />
          </div>
        </div>
      )}
    </Page>
  );
}
