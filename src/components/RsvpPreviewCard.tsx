import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>How your guests will see the RSVP</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex min-h-160 w-full items-center justify-center rounded-xl bg-muted p-4 sm:p-6 border">
          <div className="w-full max-w-85">
            {/* Phone frame */}
            <div className="overflow-hidden rounded-2xl border bg-background shadow-xl sm:rounded-[28px]">
              {/* Hero */}
              <div className="relative px-5 py-8 text-white sm:px-6 sm:py-9 flex flex-col items-center justify-center text-center bg-linear-to-br from-indigo-500 via-purple-600 to-indigo-700 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Decorative subtle lighting */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-70 pointer-events-none"></div>

                {heroImage && (
                  <div className="mb-4 overflow-hidden rounded-full border-2 border-white/80 shadow-lg w-28 h-28 shrink-0">
                    <img
                      src={heroImage}
                      alt="Couple Illustration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/65 sm:text-[11px]">
                  {eventTitle} · {dateStr}
                </div>
                <div className="mt-1 font-serif text-2xl leading-tight sm:text-[26px]">
                  {names}
                </div>
                <div className="mt-1 text-[12px] text-white/70 sm:text-[12.5px]">
                  {venue}
                  {city ? `, ${city}` : ""} · {time}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-6 sm:py-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                {dietaryPreference && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Dietary preference
                    </label>
                    <Select defaultValue="vegetarian">
                      <SelectTrigger className="w-full">
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Plus-ones
                    </label>
                    <div className="flex h-10 items-center justify-between rounded-md border px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setPlusOnes((n) => Math.max(0, n - 1))}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
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
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                        aria-label="Increase plus-ones"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                {songRequest && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Song request (optional)
                    </label>
                    <Textarea
                      placeholder="Any song you'd love to dance to?"
                      className="min-h-20 resize-none text-sm"
                    />
                  </div>
                )}

                {messageToCouple && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Message to the couple
                    </label>
                    <Textarea
                      placeholder="Leave a note for the couple"
                      className="min-h-20 resize-none text-sm"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <Button className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md h-11 text-base">
                    Yes, I'll be there!
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full text-muted-foreground"
                    >
                      Maybe
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-muted-foreground"
                    >
                      Can't make it
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
