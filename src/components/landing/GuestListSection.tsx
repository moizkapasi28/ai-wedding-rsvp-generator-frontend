type Reply = "yes" | "pending" | "not-invited";

const ceremonies = ["Mehendi", "Sangeet", "Reception"];

const guests: { name: string; replies: Reply[] }[] = [
  { name: "Meera Iyer", replies: ["yes", "yes", "yes"] },
  { name: "Aarav Shah", replies: ["not-invited", "yes", "yes"] },
  { name: "Priya Nair", replies: ["yes", "pending", "yes"] },
  { name: "Dev Menon", replies: ["not-invited", "pending", "pending"] },
  { name: "Kavya Rao", replies: ["yes", "yes", "pending"] },
  { name: "Rohit Bhat", replies: ["not-invited", "not-invited", "yes"] },
];

const details = [
  "Hundreds of guests imported from Excel or CSV in one upload",
  "Bride's side or groom's side; family, relatives, friends, colleagues or VIPs",
  "Party size, meal preference, song requests and notes, kept per ceremony",
  "Who needs a room, and the address they are staying at",
  "Attending, maybe, declined and still-pending counted apart from each other",
  "An RSVP deadline, with a first and a final reminder for whoever is silent",
];

function ReplyMark({ reply }: { reply: Reply }) {
  if (reply === "not-invited") {
    return (
      <span className="text-muted-foreground" aria-label="Not invited">
        –
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={reply === "yes" ? "Attending" : "No reply yet"}
      className={`inline-block size-2.5 rounded-full ${
        reply === "yes"
          ? "bg-primary"
          : "border border-muted-foreground"
      }`}
    />
  );
}

export default function GuestListSection() {
  return (
    <section id="guest-list" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            Import the spreadsheet once.
          </h2>
          <p className="mt-6 max-w-[42ch] leading-relaxed text-muted-foreground">
            Bring your list in from Excel, send every guest their invitation
            over WhatsApp, and let the dashboard do the counting. It changes the
            moment somebody replies — no refresh, no chasing — so the number you
            give the caterer on Thursday is the number who walk in on Saturday.
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
          <div className="rounded-xl border border-border bg-card p-5 shadow-2xl shadow-black/40 sm:p-9">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Who has replied to which ceremony
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="pb-3 text-xs font-normal text-muted-foreground sm:text-sm">
                    Guest
                  </th>
                  {ceremonies.map((ceremony) => (
                    <th
                      key={ceremony}
                      scope="col"
                      className="pb-3 text-center text-xs font-normal text-muted-foreground sm:text-sm"
                    >
                      {ceremony}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.name} className="border-b border-border">
                    <th scope="row" className="py-3.5 text-xs font-normal sm:text-sm">
                      {guest.name}
                    </th>
                    {guest.replies.map((reply, index) => (
                      <td key={ceremonies[index]} className="py-3.5 text-center">
                        <ReplyMark reply={reply} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2.5 rounded-full bg-primary" />
                Attending
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2.5 rounded-full border border-muted-foreground" />
                No reply yet
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden>–</span>
                Not invited to this one
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
