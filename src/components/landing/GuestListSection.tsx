import GuestProvider from "@/components/GuestProvider";
import { columns } from "@/components/guests/columns";
import { DataTable } from "@/components/guests/data-table";
import GuestCardList from "@/components/guests/GuestCardList";
import { sampleGuests } from "@/components/landing/sampleData";
import { RSVP_LEGEND } from "@/lib/rsvpStatus";

const details = [
  "Hundreds of guests imported from our Excel template in one upload",
  "Bride's side or groom's side; family, relatives, friends, colleagues or VIPs",
  "Party size, meal preference, song requests and notes, kept per ceremony",
  "Who needs a room, and the address they are staying at",
  "Attending, maybe, declined and still-pending counted apart from each other",
  "An RSVP deadline, with a first and a final reminder for whoever is silent",
];

export default function GuestListSection() {
  return (
    <section id="guest-list" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
              Import the spreadsheet once.
            </h2>
            <p className="mt-6 max-w-[42ch] leading-relaxed text-muted-foreground">
              Bring your list in from Excel, send every guest their invitation
              over WhatsApp, and let the dashboard do the counting. It changes
              the moment somebody replies — no refresh, no chasing — so the
              number you give the caterer on Thursday is the number who walk in
              on Saturday.
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

        {/* The Guests page's own list: cards on narrow widths, the table on
            wide ones, switching at the same container width GuestList.tsx
            does. GuestProvider backs the row menus; inert keeps them shut. */}
        <GuestProvider>
          <div inert className="@container/guests mt-14 lg:mt-20">
            <div className="@min-[60rem]/guests:hidden">
              <GuestCardList guests={sampleGuests} />
            </div>
            <div className="hidden @min-[60rem]/guests:block">
              <DataTable columns={columns} data={sampleGuests} />
            </div>

            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {RSVP_LEGEND.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span aria-hidden className={`size-2 shrink-0 rounded-full ${item.dot}`} />
                  {item.label}
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full border border-dashed border-muted-foreground"
                />
                Invite not sent yet
              </span>
            </p>
          </div>
        </GuestProvider>
      </div>
    </section>
  );
}
