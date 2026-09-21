import DashboardSummary from "@/components/DashboardSummary";
import Notice from "@/components/Notice";
import DietaryBreakDownCard from "@/components/DietaryBreakDownCard";
import { formatSide } from "@/lib/eventSide";
import Page, { PageHeader } from "@/components/Page";
import RecentRsvpsCard from "@/components/RecentRsvpsCard";
import ResponseStatsCard from "@/components/ResponseStatsCard";
import RsvpProgressCard from "@/components/RsvpProgressCard";
import { Skeleton } from "@/components/ui/skeleton";
import { DIETARY_OPTIONS } from "@/constants";
import { useWeddingLive } from "@/hooks/use-wedding-live";
import { useGetWeddingDashboard } from "@/hooks/use-wedding";
import { activeWeddingAtom, activeWeddingIdAtom } from "@/store/store";
import type { EventSide } from "@/validations/event.validation";
import { useAtomValue } from "jotai";

// Everything below sizes itself against the content width rather than the
// viewport, because collapsing the sidebar changes how much room these cards
// get without the viewport moving at all.
const SHELL = "@container/dash space-y-5";
const LIVE_ROW = "grid gap-5 @min-[60rem]/dash:grid-cols-3";
const CHART_ROW =
  "grid gap-5 @min-[42rem]/dash:grid-cols-2 @min-[68rem]/dash:grid-cols-3";

export default function Dashboard() {
  const weddingId = useAtomValue(activeWeddingIdAtom);
  const activeWedding = useAtomValue(activeWeddingAtom);
  const { data, dataUpdatedAt, isLoading, isError } =
    useGetWeddingDashboard(weddingId);
  const liveStatus = useWeddingLive(weddingId);
  const dashboard = data?.data;

  if (isLoading) {
    return (
      <Page>
        <PageHeader title="Wedding Dashboard" />
        <div className={SHELL}>
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className={LIVE_ROW}>
            <Skeleton className="h-[26rem] rounded-xl @min-[60rem]/dash:col-span-2" />
            <Skeleton className="h-[26rem] rounded-xl" />
          </div>
          <div className={CHART_ROW}>
            <Skeleton className="h-[21rem] rounded-xl @min-[42rem]/dash:col-span-2 @min-[68rem]/dash:col-span-1" />
            <Skeleton className="h-[21rem] rounded-xl" />
            <Skeleton className="h-[21rem] rounded-xl" />
          </div>
        </div>
      </Page>
    );
  }

  if (isError || !dashboard) {
    return (
      <Page>
        <PageHeader title="Wedding Dashboard" />
        <Notice
          title="We couldn't load this dashboard."
          body="Something went wrong on the way to the server. Refresh the page to try again."
        />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title="Wedding Dashboard" />

      <div className={SHELL}>
        <DashboardSummary stats={dashboard.stats} wedding={activeWedding} />

        {/* The two live parts, above the fold */}
        <div className={LIVE_ROW}>
          <div className="@min-[60rem]/dash:col-span-2">
            <RsvpProgressCard events={dashboard.events} />
          </div>
          <RecentRsvpsCard
            rsvps={dashboard.recentRsvps}
            now={dataUpdatedAt}
            liveStatus={liveStatus}
          />
        </div>

        <div className={CHART_ROW}>
          {/* A week of daily bars needs width more than the donuts do, so it
              takes the whole row while there are only two columns. */}
          <div className="@min-[42rem]/dash:col-span-2 @min-[68rem]/dash:col-span-1">
            <ResponseStatsCard data={dashboard.dailyResponses} />
          </div>
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
    </Page>
  );
}
