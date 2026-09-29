import RecentRsvpsCard from "@/components/RecentRsvpsCard";
import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import {
  SAMPLE_NOW,
  sampleRecentRsvps,
  sampleRsvpEvent,
} from "@/components/landing/sampleData";
import { Link } from "react-router-dom";

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

        {/* What a guest opens and the reply it lands as on the couple's
            dashboard: both are the app's own components with sample data, so
            this is exactly what the product shows. inert: a picture, not a form. */}
        <div inert className="lg:col-span-5 lg:col-start-8">
          <div className="mx-auto max-w-sm lg:mr-0 lg:max-w-md">
            <div className="settle shadow-2xl shadow-black/40">
              <RsvpPhonePreview event={sampleRsvpEvent} />
            </div>

            <div className="settle-reply relative z-10 -mt-3 ml-10 rounded-xl shadow-xl shadow-black/50 sm:ml-20">
              <RecentRsvpsCard
                rsvps={sampleRecentRsvps.slice(0, 2)}
                now={SAMPLE_NOW}
                liveStatus="live"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
