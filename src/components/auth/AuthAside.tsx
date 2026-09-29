import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { sampleRsvpEvent } from "@/components/landing/sampleData";

/**
 * The right-hand panel on every auth page: the thing the account is for,
 * rather than decoration. Hidden below lg, where the form is the whole screen.
 * The card is the real RSVP preview with sample data, so it's exactly what
 * guests open; inert because it's a picture here, not a form.
 */
export default function AuthAside() {
  return (
    <aside className="hidden h-screen overflow-hidden border-l border-border bg-card lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-10">
      <div className="mx-auto w-full max-w-sm">
        <div inert className="shadow-2xl shadow-black/40">
          <RsvpPhonePreview event={sampleRsvpEvent} />
        </div>

        <p className="mt-10 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
          This is what your guests open. One link each, one answer per ceremony,
          and a count that keeps itself.
        </p>
      </div>
    </aside>
  );
}
