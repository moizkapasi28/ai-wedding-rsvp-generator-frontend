import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getInitials, getWeddingColor } from "@/lib/weddingColor";
import { daysUntilWedding, formatWeddingDay } from "@/lib/weddingDate";
import type { Wedding, WeddingDashboard } from "@/models/wedding.model";

type Props = {
  stats: WeddingDashboard["stats"];
  wedding: Wedding | null;
};

/**
 * The whole top of the dashboard in one panel rather than four cards: the
 * countdown reads first, the four numbers sit beside it. Sizes come from the
 * content width, not the viewport, so collapsing the sidebar re-lays it out.
 */
export default function DashboardSummary({ stats, wedding }: Props) {
  return (
    <Card className="@container/summary p-5">
      <div className="grid gap-6 @min-[46rem]/summary:grid-cols-[auto_1fr] @min-[46rem]/summary:gap-8">
        <Countdown wedding={wedding} />

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 @min-[30rem]/summary:grid-cols-4">
          <Stat
            value={stats.totalGuests}
            label="Guests invited"
            note={
              stats.guestsThisWeek > 0
                ? `${stats.guestsThisWeek} added this week`
                : undefined
            }
          />
          <Stat
            value={stats.attending}
            label="Attending"
            note={`${stats.confirmationRate}% confirmed`}
          />
          <Stat
            value={stats.pending}
            label="Awaiting reply"
            note={
              stats.responsesThisWeek > 0
                ? `${stats.responsesThisWeek} replies this week`
                : undefined
            }
          />
          <Stat value={stats.accommodationRequired} label="Need a room" />
        </dl>
      </div>
    </Card>
  );
}

/**
 * The one thing on this page nobody has to work out. It carries the wedding's
 * identity colour — the same chip it wears on its card and in the sidebar
 * switcher — so the page says which wedding you are looking at without
 * repeating the title the app bar already shows.
 */
function Countdown({ wedding }: { wedding: Wedding | null }) {
  const days = daysUntilWedding(wedding?.date);
  // Only a real date earns the second line — otherwise it would read
  // "No date set yet" followed by "Date not set".
  const place = [days === null ? null : formatWeddingDay(wedding?.date), wedding?.city]
    .filter(Boolean)
    .join(" · ");

  const headline =
    days === null
      ? { value: "—", unit: "No date set yet" }
      : days > 1
        ? { value: String(days), unit: "days to go" }
        : days === 1
          ? { value: "1", unit: "day to go" }
          : days === 0
            ? { value: "Today", unit: "is the day" }
            : { value: String(-days), unit: days === -1 ? "day ago" : "days ago" };

  return (
    <div className="flex items-center gap-4 @min-[46rem]/summary:border-r @min-[46rem]/summary:border-border @min-[46rem]/summary:pr-8">
      {wedding && (
        <span
          aria-hidden
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-sm font-bold text-white",
            getWeddingColor(wedding.id),
          )}
        >
          {getInitials(wedding.bride_name, wedding.groom_name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display text-3xl leading-none font-medium tracking-[-0.03em] tabular-nums">
          {headline.value}
        </p>
        <p className="mt-1.5 text-sm">{headline.unit}</p>
        {place && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {place}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  note,
}: {
  value: number;
  label: string;
  note?: string;
}) {
  return (
    <div className="min-w-0">
      <dd className="font-display text-2xl leading-none font-medium tracking-[-0.03em] tabular-nums">
        {value}
      </dd>
      <dt className="mt-1.5 truncate text-sm">{label}</dt>
      {/* Kept on one line: these are asides, not a second label */}
      {note && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{note}</p>
      )}
    </div>
  );
}
