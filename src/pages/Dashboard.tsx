import DashboardStatsCard from "@/components/DashboardStatsCard";
import DietaryBreakDownCard from "@/components/DietaryBreakDownCard";
import Page, { PageHeader } from "@/components/Page";
import ResponseStatsCard from "@/components/ResponseStatsCard";
import RsvpProgressCard from "@/components/RsvpProgressCard";

export default function Dashboard() {
  return (
    <Page>
      <PageHeader title="Wedding Dashboard" />
      <div className="mt-auto space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DashboardStatsCard />
          <DashboardStatsCard />
          <DashboardStatsCard />
          <DashboardStatsCard />
        </div>

        {/* Graphs */}
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RsvpProgressCard />
          </div>
          <div className="lg:col-span-1">
            <DietaryBreakDownCard />
          </div>
        </div>

        {/* Graphs */}
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ResponseStatsCard />
          </div>
          <div className="lg:col-span-1">
            <DietaryBreakDownCard />
          </div>
        </div>
      </div>
    </Page>
  );
}
