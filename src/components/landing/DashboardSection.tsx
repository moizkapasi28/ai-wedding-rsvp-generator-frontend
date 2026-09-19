// Mirrors the real dashboard: the stat tiles from Dashboard.tsx, the per-event
// RSVP progress bar, and the live recent-replies feed fed by the SSE stream.
const tiles = [
  { value: "412", label: "Guests invited", note: "18 added this week" },
  { value: "288", label: "Attending", note: "70% confirmed" },
  { value: "94", label: "Awaiting reply", note: "31 replies this week" },
  { value: "46", label: "Need a room", note: "across 3 hotels" },
];

const progress = [
  { event: "Mehendi", confirmed: 65, maybe: 8, declined: 12, pending: 15 },
  { event: "Sangeet", confirmed: 74, maybe: 6, declined: 9, pending: 11 },
  { event: "Reception", confirmed: 58, maybe: 11, declined: 7, pending: 24 },
];

const recent = [
  { name: "Ishaan Kapoor", detail: "Attending the Reception, 3 guests" },
  { name: "Farah Sheikh", detail: "Maybe for the Sangeet" },
  { name: "Vikram Iyer", detail: "Can't make the Mehendi" },
];

const segments = [
  { key: "confirmed", className: "bg-primary" },
  { key: "maybe", className: "bg-primary/45" },
  { key: "declined", className: "bg-muted-foreground/40" },
  { key: "pending", className: "bg-muted" },
] as const;

const legend = [
  { label: "Attending", className: "bg-primary" },
  { label: "Maybe", className: "bg-primary/45" },
  { label: "Declined", className: "bg-muted-foreground/40" },
  { label: "Pending", className: "bg-muted" },
];

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
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            One screen, and you already know.
          </h2>
          <p className="mt-6 max-w-[42ch] leading-relaxed text-muted-foreground">
            Open the dashboard the morning of and there is nothing to work out.
            The numbers are already the answer, per ceremony, and they moved
            while you were asleep.
          </p>

          <ul className="mt-9">
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

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-2xl shadow-black/40 sm:p-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {tiles.map((tile) => (
                <div key={tile.label}>
                  <p className="text-2xl font-medium tracking-[-0.03em] tabular-nums sm:text-3xl">
                    {tile.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tile.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">
                    {tile.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-7">
              {progress.map((row) => (
                <div key={row.event} className="mb-5 last:mb-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-medium">{row.event}</p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {row.confirmed}% confirmed
                    </p>
                  </div>
                  <div className="mt-2 flex h-1.5 overflow-hidden rounded-full">
                    {segments.map((segment) => (
                      <div
                        key={segment.key}
                        className={segment.className}
                        style={{ width: `${row[segment.key]}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {legend.map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={`size-2 rounded-full ${item.className}`}
                    />
                    {item.label}
                  </span>
                ))}
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-7">
              <p className="flex items-center gap-2 text-sm font-medium">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-primary"
                />
                Replies coming in
              </p>
              <ul className="mt-4">
                {recent.map((reply) => (
                  <li
                    key={reply.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-t border-border py-2.5 first:border-t-0 first:pt-0"
                  >
                    <span className="text-sm">{reply.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {reply.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
