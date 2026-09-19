import {
  CalendarDays,
  FileSpreadsheet,
  LayoutTemplate,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI invitation cards",
    body: "Generate a wedding card from design presets, or upload a card you like and work from that.",
  },
  {
    icon: LayoutTemplate,
    title: "RSVP page builder",
    body: "Set the header image, wording, layout and colours of the page your guests open.",
  },
  {
    icon: CalendarDays,
    title: "A guest list per ceremony",
    body: "Mehendi, Haldi, Sangeet, Reception — each with its own invites and its own count.",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel and CSV import",
    body: "Upload your list once. Hundreds of guests, their phone numbers and dietary notes in one go.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp invitations",
    body: "Every guest gets their own RSVP link, ready to send on the app they already use.",
  },
  {
    icon: TrendingUp,
    title: "A dashboard that updates itself",
    body: "Replies land live. Set an RSVP deadline and remind whoever has not answered.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-x-16">
        <h2 className="max-w-[22ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem] lg:col-span-3">
          Everything the wedding needs, in one place.
        </h2>

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-t border-border pt-6">
              <Icon className="size-5 text-muted-foreground" aria-hidden />
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
