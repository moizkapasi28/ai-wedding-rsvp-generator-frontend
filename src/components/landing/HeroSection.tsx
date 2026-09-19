import { Link } from "react-router-dom";

const ceremonies = [
  { name: "Mehendi", when: "12 Feb, 11:00" },
  { name: "Haldi", when: "13 Feb, 09:30" },
  { name: "Sangeet", when: "13 Feb, 19:00" },
  { name: "Reception", when: "14 Feb, 19:30" },
];

export default function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-16 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-6">
          <h1 className="text-balance text-[2.6rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[4rem]">
            Send the invitation. Know exactly who is coming.
          </h1>

          <p className="mt-7 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            WeddlyAI generates your wedding cards, gives every guest their own
            RSVP link to open on WhatsApp, and keeps the count for each ceremony
            as the replies come in.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/signup"
              className="rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start free
            </Link>
            <a
              href="#programme"
              className="text-sm underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground"
            >
              See how it works
            </a>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Set up your first wedding in a few minutes.
          </p>
        </div>

        {/* The invitation and the reply it received: the one animated moment. */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="mx-auto max-w-sm lg:mr-0 lg:max-w-md">
            <div className="-rotate-[1.25deg]">
              <article className="settle relative rounded-xl border border-border bg-card px-7 py-10 shadow-2xl shadow-black/40 sm:px-9 sm:py-12">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 rounded-lg border border-border"
                />

                <div className="relative text-center">
                  <p className="text-xs tracking-wide text-muted-foreground">
                    together with their families
                  </p>
                  <p className="mt-6 text-4xl font-medium leading-none tracking-[-0.03em] sm:text-[2.75rem]">
                    Ananya
                  </p>
                  <p className="my-2.5 text-sm text-muted-foreground">and</p>
                  <p className="text-4xl font-medium leading-none tracking-[-0.03em] sm:text-[2.75rem]">
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

            <div className="settle-reply relative z-10 -mt-7 ml-6 rotate-[1.75deg] rounded-lg border border-border bg-muted p-4 shadow-xl shadow-black/50">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                />
                <div>
                  <p className="text-sm">Meera Iyer replied</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Coming to the Mehendi, Sangeet and Reception. Two guests,
                    one vegetarian.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
