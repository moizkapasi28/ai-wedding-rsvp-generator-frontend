import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "lucide-react";
import RsvpInviteHero from "./RsvpInviteHero";
import {
  inviteFieldClass,
  inviteLabelClass,
  inviteStepperButtonClass,
  inviteStepperClass,
} from "@/lib/rsvpFieldStyles";
import RsvpReplyButtons from "./RsvpReplyButtons";
import { useState } from "react";

import type { EventWithInvitesAndWedding } from "@/models/pageSetting.model";

export default function RsvpPhonePreview({
  event,
  heroImage,
  dietaryPreference = false,
  plusOnesEnabled = false,
  songRequest = false,
  messageToCouple = false,
}: {
  event?: EventWithInvitesAndWedding;
  heroImage?: string | null;
  dietaryPreference?: boolean;
  plusOnesEnabled?: boolean;
  songRequest?: boolean;
  messageToCouple?: boolean;
} = {}) {
  const [plusOnes, setPlusOnes] = useState(1);

  const eventTitle = event?.title || "Wedding";
  const dateStr = event?.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "15 Dec 2026";
  const bride = event?.wedding?.bride_name || "Riya";
  const groom = event?.wedding?.groom_name || "Arjun";

  let names = `${bride} & ${groom}`;
  if (event?.event_side === "GROOM") {
    names = groom;
  } else if (event?.event_side === "BRIDE") {
    names = bride;
  }
  const venue = event?.venue || "The Oberoi Lawns";
  const city = event?.city || "Udaipur";
  const time = event?.time || "8:00 PM";
  const description =
    event?.description ||
    "Join us for dinner and dancing as we celebrate our new beginning!";

  return (
    // The heading lives in the card around this. The hero and the reply
    // buttons come from the same components the real RSVP form uses, so the
    // preview can't drift away from what guests actually get.
    // h-full/flex-1 so it can fill a stretched grid cell beside the invitation
    // in Guest Preview; inside Page Settings nothing stretches it, so it stays
    // at its natural height there.
    <div className="flex h-full w-full flex-col">
      <div className="relative flex w-full flex-1 flex-col">
        {/* No phone bezel: what a guest opens is this card, not a handset
            mock. Square edges so it reads as stationery rather than a UI chip. */}
        <div className="relative flex w-full flex-1 flex-col overflow-hidden border border-border bg-background">
          <RsvpInviteHero
            names={names}
            eventTitle={eventTitle}
            date={dateStr}
            place={[venue, city].filter(Boolean).join(", ")}
            time={time}
            image={heroImage}
          />

          {/* Body */}
          <div className="flex flex-1 flex-col space-y-5 px-5 py-5 sm:space-y-6 sm:px-6 sm:py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            {dietaryPreference && (
              <div className="flex flex-col gap-2.5">
                <label className={inviteLabelClass}>
                  Dietary preference
                </label>
                <Select defaultValue="vegetarian">
                  <SelectTrigger className={`w-full ${inviteFieldClass}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">
                      Non-vegetarian
                    </SelectItem>
                    <SelectItem value="jain">Jain</SelectItem>
                    <SelectItem value="gluten-free">Gluten-free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {plusOnesEnabled && (
              <div className="flex flex-col gap-2.5">
                <label className={inviteLabelClass}>
                  Plus-ones
                </label>
                <div className={inviteStepperClass}>
                  <button
                    type="button"
                    onClick={() => setPlusOnes((n) => Math.max(0, n - 1))}
                    className={inviteStepperButtonClass}
                    aria-label="Decrease plus-ones"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center text-sm font-semibold text-foreground">
                    {plusOnes}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPlusOnes((n) => Math.min(9, n + 1))}
                    className={inviteStepperButtonClass}
                    aria-label="Increase plus-ones"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {songRequest && (
              <div className="flex flex-col gap-2.5">
                <label className={inviteLabelClass}>
                  Song request (optional)
                </label>
                <Textarea
                  placeholder="Any song you'd love to dance to?"
                  className={`min-h-20 resize-none text-sm ${inviteFieldClass}`}
                />
              </div>
            )}

            {messageToCouple && (
              <div className="flex flex-col gap-2.5">
                <label className={inviteLabelClass}>
                  Message to the couple
                </label>
                <Textarea
                  placeholder="Leave a note for the couple"
                  className={`min-h-20 resize-none text-sm ${inviteFieldClass}`}
                />
              </div>
            )}

            {/* mt-auto: when the card is stretched, the replies sit at the
                foot of it rather than leaving a gap under them */}
            <RsvpReplyButtons className="mt-auto pt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
