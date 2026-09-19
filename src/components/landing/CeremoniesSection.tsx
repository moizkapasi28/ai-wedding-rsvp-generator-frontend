const ceremonies = [
  { name: "Mehendi", when: "12 February", attending: 78, invited: 120 },
  { name: "Haldi", when: "13 February", attending: 96, invited: 140 },
  { name: "Sangeet", when: "13 February", attending: 210, invited: 260 },
  { name: "Reception", when: "14 February", attending: 288, invited: 340 },
];

export default function CeremoniesSection() {
  return (
    <section id="ceremonies" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            One wedding, four guest lists.
          </h2>
          <p className="mt-6 max-w-[42ch] leading-relaxed text-muted-foreground">
            Each ceremony carries its own date, time, venue and map pin, and
            its own list of people. A guest asked to the Sangeet but not the
            Haldi only ever sees the Sangeet, and replies to it on its own. Four
            functions, four counts, one dashboard.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul>
            {ceremonies.map((ceremony) => (
              <li
                key={ceremony.name}
                className="border-t border-border py-5 last:border-b"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-xl font-medium tracking-tight">{ceremony.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ceremony.when}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-[3px] flex-1 bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${Math.round(
                          (ceremony.attending / ceremony.invited) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {ceremony.attending} of {ceremony.invited} attending
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
