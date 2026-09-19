import { MapPin } from "lucide-react";

const answers = [
  { label: "Guests in your party", value: "2" },
  { label: "Meal", value: "Vegetarian" },
  { label: "Song request", value: "Kajra Re" },
];

const details = [
  "Attending, maybe, or can't make it — and they can change their answer until the deadline",
  "Ask only what you need: party size, meal preference, a song request, a note for you",
  "Date, time, venue and a map pin on every ceremony",
  "Opens in any phone browser. Nothing to install, no account, no password",
];

export default function GuestExperienceSection() {
  return (
    <section
      id="guest-experience"
      className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <div className="max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/40 sm:p-8 lg:max-w-md">
            <h3 className="text-xl font-medium">Sangeet</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Friday 13 February, 7:00 pm
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Jagmandir Island Palace, Udaipur
            </p>

            <p className="mt-7 border-t border-border pt-6 text-sm">
              Will you be there?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                Attending
              </span>
              <span className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground">
                Maybe
              </span>
              <span className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground">
                Can't make it
              </span>
            </div>

            <dl className="mt-7">
              {answers.map((answer) => (
                <div
                  key={answer.label}
                  className="flex items-baseline justify-between gap-4 border-t border-border py-3"
                >
                  <dt className="text-sm text-muted-foreground">
                    {answer.label}
                  </dt>
                  <dd className="text-sm font-medium">{answer.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-xs text-muted-foreground">
              Replies close 1 February
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            Your guests tap one link. That is the whole thing.
          </h2>
          <p className="mt-6 max-w-[48ch] leading-relaxed text-muted-foreground">
            The WhatsApp message opens a page that already knows who they are
            and which ceremony they were asked to. Your grandmother can use it,
            because there is nothing to use — she taps, she answers, she is
            done.
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
      </div>
    </section>
  );
}
