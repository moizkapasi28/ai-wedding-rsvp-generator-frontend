import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { sampleRsvpEvent } from "@/components/landing/sampleData";

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
          {/* The real RSVP card with every optional question switched on;
              inert because it's a picture here, not a form */}
          <div inert className="max-w-sm shadow-2xl shadow-black/40 lg:max-w-md">
            <RsvpPhonePreview
              event={sampleRsvpEvent}
              dietaryPreference
              plusOnesEnabled
              songRequest
              messageToCouple
            />
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
