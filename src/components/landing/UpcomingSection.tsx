import { Images, QrCode } from "lucide-react";

// ponytail: neither of these ships yet. They are labelled in development on
// purpose — move the item into FeaturesSection when it actually lands.
const upcoming = [
  {
    icon: QrCode,
    title: "QR code attendance",
    body: "Every confirmed guest gets a QR code alongside their invitation. Scan it at the door and each ceremony's headcount stops being an estimate and becomes a live arrival count — who came, who replied yes and stayed home, and how many plates you actually need.",
  },
  {
    icon: Images,
    title: "AI photo gallery",
    body: "One shared gallery per ceremony. Photos are sorted and captioned as they come in, so the Mehendi pictures stay with the Mehendi, and you can send every guest the set from the functions they were at.",
  },
];

export default function UpcomingSection() {
  return (
    <section
      id="upcoming"
      className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-3">
          <h2 className="max-w-[16ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            Being built now.
          </h2>
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            Neither of these has shipped yet. They are next, and they arrive in
            your account the day they do.
          </p>
        </div>

        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2 lg:col-span-9">
          {upcoming.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-t border-border pt-6">
              <div className="flex items-center justify-between gap-4">
                <Icon className="size-5 text-muted-foreground" aria-hidden />
                <span className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  In development
                </span>
              </div>
              <h3 className="mt-5 font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
