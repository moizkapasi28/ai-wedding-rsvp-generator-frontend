const ceremonies = [
  { name: "Mehendi", when: "12 Feb, 11:00" },
  { name: "Haldi", when: "13 Feb, 09:30" },
  { name: "Sangeet", when: "13 Feb, 19:00" },
  { name: "Reception", when: "14 Feb, 19:30" },
];

/**
 * The right-hand panel on every auth page: the thing the account is for,
 * rather than decoration. Hidden below lg, where the form is the whole screen.
 */
export default function AuthAside() {
  return (
    <aside className="hidden h-screen overflow-hidden border-l border-border bg-card lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="-rotate-[1.25deg]">
          <article className="relative rounded-xl border border-border bg-background px-8 py-10 shadow-2xl shadow-black/40">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-lg border border-border"
            />
            <div className="relative text-center">
              <p className="text-xs text-muted-foreground">
                together with their families
              </p>
              <p className="mt-6 text-[2.5rem] font-medium leading-none tracking-[-0.03em]">
                Ananya
              </p>
              <p className="my-2.5 text-sm text-muted-foreground">and</p>
              <p className="text-[2.5rem] font-medium leading-none tracking-[-0.03em]">
                Rohan
              </p>
              <p className="mt-6 text-[0.8rem] text-muted-foreground">
                Saturday, 14 February 2026 in Udaipur
              </p>
            </div>

            <dl className="relative mt-9 border-t border-border">
              {ceremonies.map((ceremony) => (
                <div
                  key={ceremony.name}
                  className="flex items-baseline justify-between border-b border-border py-2.5"
                >
                  <dt className="text-base font-medium">{ceremony.name}</dt>
                  <dd className="text-xs text-muted-foreground">
                    {ceremony.when}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <p className="mt-10 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
          This is what your guests open. One link each, one answer per ceremony,
          and a count that keeps itself.
        </p>
      </div>
    </aside>
  );
}
