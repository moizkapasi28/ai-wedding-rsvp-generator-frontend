// The real options from src/constants/index.ts, shown the way the card form
// asks for them.
const specification = [
  { field: "Design", value: "Vintage Royal" },
  { field: "Paper", value: "Heavy Linen" },
  { field: "Foil", value: "Gold Foil" },
  { field: "Edging", value: "Torn / Deckled" },
  { field: "Monogram", value: "Calligraphic Crest" },
];

const details = [
  "Design, paper, foil, edging and monogram picked from presets",
  "Or upload a card you like and generate from that instead",
  "A matching header image for the page your guests open",
  "Wording, layout and colours arranged in the page builder",
];

export default function InvitationsSection() {
  return (
    <section id="invitations" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <div className="max-w-sm lg:max-w-md rounded-xl border border-border bg-card p-7 shadow-2xl shadow-black/40 sm:p-9">
            <p className="text-base font-medium">Invitation card</p>
            <dl className="mt-7">
              {specification.map((row) => (
                <div
                  key={row.field}
                  className="flex items-baseline justify-between gap-6 border-t border-border py-3"
                >
                  <dt className="text-sm text-muted-foreground">{row.field}</dt>
                  <dd className="text-right text-sm font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 flex items-center gap-2.5 border-t border-border pt-5 text-sm">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-primary"
              />
              Card generated for the Reception
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            Pick the paper, the foil and the frame.
          </h2>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-muted-foreground">
            Choose how the card should look and WeddlyAI draws it, along with a
            header image to match on the page your guests open. If you already
            have a card you like, upload it and work from that instead.
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
