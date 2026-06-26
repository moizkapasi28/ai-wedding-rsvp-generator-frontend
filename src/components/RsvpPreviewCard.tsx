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

export default function RsvpPhonePreview() {
  const [plusOnes, setPlusOnes] = useState(1);

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
              <div
                className="px-5 py-6 text-white sm:px-6 sm:py-7"
                style={{
                  background: "linear-gradient(150deg, #2E5C4D, #1C0B2E 130%)",
                }}
              >
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/65 sm:text-[11px]">
                  Reception · 15 Dec 2026
                </div>
                <div className="mt-1 font-serif text-2xl leading-tight sm:text-[26px]">
                  Riya &amp; Arjun
                </div>
                <div className="mt-1 text-[12px] text-white/70 sm:text-[12.5px]">
                  The Oberoi Lawns, Udaipur · 8:00 PM
                </div>
              </div>

              {/* Body */}
              <div className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-6 sm:py-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Join us for dinner and dancing as we celebrate our new
                  beginning!
                </p>

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

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Song request (optional)
                  </label>
                  <Textarea
                    placeholder="Any song you'd love to dance to?"
                    className="min-h-20 resize-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="w-full">
                    Can't make it
                  </Button>
                  <Button
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: "#2E5C4D" }}
                  >
                    Confirm RSVP
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
