import DashboardSummary from "@/components/DashboardSummary";
import RecentRsvpsCard from "@/components/RecentRsvpsCard";
import RsvpProgressCard from "@/components/RsvpProgressCard";
import {
  SAMPLE_NOW,
  sampleDashboardStats,
  sampleEvents,
  sampleRecentRsvps,
  sampleWedding,
} from "@/components/landing/sampleData";

const details = [
  "Guests invited, attending, awaiting reply and needing a room, at a glance",
  "A confirmed / maybe / declined / pending split for every ceremony separately",
  "Replies as they land, without refreshing the page",
  "Meal preferences broken down across everyone who said yes",
  "Who is coming from the bride's side and who from the groom's",
  "Replies per day, so you can see whether a reminder actually worked",
];

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
              One screen, and you already know.
            </h2>
            <p className="mt-6 max-w-[42ch] leading-relaxed text-muted-foreground">
              Open the dashboard the morning of and there is nothing to work
              out. The numbers are already the answer, per ceremony, and they
              moved while you were asleep.
            </p>
          </div>

          <ul className="lg:col-span-6 lg:col-start-7">
            {details.map((detail) => (
              <li
                key={detail}
                className="border-t border-border py-4 text-sm leading-relaxed last:border-b"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>

        {/* The top of the real dashboard, full width because that's how it's
            laid out in the app: the same components and the same container
            breakpoints as Dashboard.tsx, fed sample data. inert: a picture. */}
        <div inert className="@container/dash mt-14 space-y-5 lg:mt-20">
          <DashboardSummary stats={sampleDashboardStats} wedding={sampleWedding} />
          <div className="grid gap-5 @min-[60rem]/dash:grid-cols-3">
            <div className="@min-[60rem]/dash:col-span-2">
              <RsvpProgressCard events={sampleEvents} />
            </div>
            <RecentRsvpsCard
              rsvps={sampleRecentRsvps}
              now={SAMPLE_NOW}
              liveStatus="live"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
