import DesignConfigForm from "@/components/DesignConfigForm";
import { Form } from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { AiInviteFormValues } from "@/validations/inviteCard.validation";
import { useForm } from "react-hook-form";

const details = [
  "Design, texture, typography, foil, monogram and border picked from presets",
  "Or generate from an example you like, or upload your finished card as it is",
  "A matching header image for the page your guests open",
  "The questions each ceremony's RSVP page asks, chosen in its page settings",
];

export default function InvitationsSection() {
  // The Invite Card page's real design form, filled with one set of choices
  const form = useForm<AiInviteFormValues>({
    defaultValues: {
      activeTab: "describe",
      photoType: "couple",
      designPreset: "vintage_royal",
      textureEmulation: "heavy_linen",
      typographyPairing: "romantic",
      metallicAccents: "gold_foil",
      negativeSpace: "bordered_frame",
      monogramStyle: "calligraphic_crest",
      textAlignment: "strict",
      edgeStyling: "torn_deckled",
    },
  });

  return (
    <section id="invitations" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-6">
          {/* inert: a picture of the form, not a form. The app layout supplies
              the TooltipProvider its info icons need; the landing page doesn't. */}
          <div inert className="rounded-xl shadow-2xl shadow-black/40">
            <TooltipProvider>
              <Form {...form}>
                <DesignConfigForm />
              </Form>
            </TooltipProvider>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            Pick the paper, the foil and the frame.
          </h2>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-muted-foreground">
            Choose how the card should look and WeddlyAI draws it, along with a
            header image to match on the page your guests open. Have a design
            you like? Give it as an example. Card already made? Upload it and
            use it as it is.
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
