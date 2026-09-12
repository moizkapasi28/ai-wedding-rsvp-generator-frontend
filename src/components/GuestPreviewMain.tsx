import { getSideBadgeStyles } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useGenerateViewUrl,
  useGetGuestEventInviteFormatsInfinite,
} from "@/hooks/use-pageSetting";
import { cn } from "@/lib/utils";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { Loader2, Minus, Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GuestPreviewMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventParam = searchParams.get("event");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetGuestEventInviteFormatsInfinite(activeWeddingId, 5);

  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];

  const selectedEvent = eventParam
    ? events.find((e) => e.id === eventParam) || events[0]
    : events[0];

  const format = selectedEvent?.guestEventInviteFormat?.[0];

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const generateViewUrlMutation = useGenerateViewUrl();

  useEffect(() => {
    if (format?.generated_image) {
      generateViewUrlMutation
        .mutateAsync(format.generated_image)
        .then((res) => {
          if (res.data?.url) {
            setGeneratedImage(res.data.url);
          }
        })
        .catch(console.error);
    } else {
      setGeneratedImage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format?.generated_image]);

  const [plusOnes, setPlusOnes] = useState(1);

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col gap-4 mt-6">
          {/* Top bar skeletons */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2 w-full">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>

          {/* Browser skeleton */}
          <Skeleton className="w-full h-[80vh] min-h-[700px] rounded-[2rem]" />
        </div>
      </>
    );
  }

  if (isError || !selectedEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-xl font-bold mb-2">No Preview Available</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't load the RSVP preview for this event.
        </p>
      </div>
    );
  }

  const handleSelectEvent = (eventId: string) => {
    navigate(`?event=${eventId}`, { replace: true });
  };

  const eventTitle = selectedEvent.title || "Wedding Ceremony";
  const dateStr = selectedEvent.date
    ? new Date(selectedEvent.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "15 Dec 2026";
  const bride = selectedEvent.wedding?.bride_name || "Riya";
  const groom = selectedEvent.wedding?.groom_name || "Arjun";

  let names = `${bride} & ${groom}`;
  if (selectedEvent.event_side === "GROOM") {
    names = groom;
  } else if (selectedEvent.event_side === "BRIDE") {
    names = bride;
  }
  const venue = selectedEvent.venue || "The Oberoi Lawns";
  const city = selectedEvent.city || "Udaipur";
  const time = selectedEvent.time || "8:00 PM";
  const description =
    selectedEvent.description ||
    "Join us for dinner and dancing as we celebrate our new beginning!";

  const dietaryPreference = format?.dietary_preference || false;
  const plusOnesEnabled = format?.plus_ones || false;
  const songRequest = format?.song_request || false;
  const messageToCouple = format?.message || false;

  const mapQuery = encodeURIComponent(`${venue} ${city || ""}`);

  return (
    <>
      {/* Control Bar: Event Selection & Actions (Same layout as PageSettings) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 w-full">
          {events.map((event) => {
            const sideStyles = getSideBadgeStyles(event.event_side as any);
            const isSelected = selectedEvent.id === event.id;

            return (
              <Button
                key={event.id}
                variant="outline"
                className={cn(
                  "rounded-full transition-all duration-200",
                  sideStyles,
                  isSelected
                    ? "ring-1 ring-current border-transparent opacity-100 font-semibold shadow-sm"
                    : "opacity-70 hover:opacity-100",
                )}
                onClick={() => handleSelectEvent(event.id)}
              >
                {event.title}
              </Button>
            );
          })}
          {hasNextPage && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              View More
            </Button>
          )}
        </div>

        {events.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="default">
              <Send className="w-4 h-4 mr-2" />
              <span>Send RSVP in Bulk</span>
            </Button>
          </div>
        )}
      </div>

      {/* The Mocked Preview Browser Window */}
      <div className="w-full flex flex-col flex-1 items-center">
        <div className="w-full transition-all duration-500 ease-in-out border-[8px] border-muted/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden bg-background relative flex flex-col h-[80vh] min-h-[700px] rounded-[2rem]">

          {/* Dynamic Background - Placed at the root of the mock browser so it doesn't clip when scrolling */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background">
            {generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40 scale-110 blur-3xl"
                />
                <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl"></div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
            )}
          </div>

          {/* Scrollable Preview Area */}
          <div className="relative z-10 w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scrollbar-thin scrollbar-thumb-muted-foreground/20">

            {/* The Actual Guest Facing Content Grid */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10 items-stretch">

              {/* Column 1: AI Wedding Card */}
              <div className="w-full flex justify-center lg:sticky lg:top-4 h-full">
                <div className="w-full max-w-full lg:max-w-[360px] aspect-[9/16] relative overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 flex-shrink-0 rounded-[2rem] lg:max-h-[750px]">
                  <img
                    src={generatedImage || "/test-preview.jpeg"}
                    alt="Invitation Artwork"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Column 2: Location & Map */}
              <div className="w-full bg-background/60 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden">
                <h2 className="font-serif text-3xl mb-4 text-foreground shrink-0">
                  When & Where
                </h2>

                <div className="text-sm text-muted-foreground mb-8 max-w-sm space-y-2 shrink-0">
                  <div className="flex items-center justify-center gap-2 font-medium text-foreground">
                    <span>{dateStr}</span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>{time}</span>
                  </div>
                  <p className="text-base text-foreground/80 font-serif italic">
                    {venue}{city ? `, ${city}` : ""}
                  </p>
                </div>

                {/* Interactive Map */}
                {venue && (
                  <div className="w-full flex-1 rounded-2xl overflow-hidden border-4 border-muted/50 shadow-inner relative min-h-[450px] lg:min-h-0 lg:h-[450px]">
                    <iframe
                      style={{ border: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      className="grayscale opacity-90 transition-all duration-700 hover:grayscale-0 hover:opacity-100 object-cover"
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Column 3: RSVP Form */}
              <div className="w-full h-full rounded-[2rem] bg-background shadow-2xl relative flex flex-col border border-black/10 dark:border-white/10 overflow-hidden">

                {/* Hero Header */}
                <div className="relative shrink-0 px-6 py-8 sm:py-10 text-white flex flex-col items-center justify-center text-center bg-linear-to-br from-indigo-500 via-purple-600 to-indigo-700 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-70 pointer-events-none"></div>

                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/70 mb-1 relative z-10">
                    {eventTitle} · {dateStr}
                  </div>
                  <div className="font-serif text-3xl leading-tight mb-2 relative z-10">
                    {names}
                  </div>
                  <div className="text-xs text-white/80 relative z-10">
                    {venue}
                    {city ? `, ${city}` : ""} · {time}
                  </div>
                </div>

                {/* Form Body */}
                <div className="flex flex-col flex-1 px-5 sm:px-6 py-8">
                  <p className="text-sm leading-relaxed text-muted-foreground text-center mb-6 shrink-0">
                    {description}
                  </p>

                  <div className="space-y-6">
                    {dietaryPreference && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-foreground">
                          Dietary preference
                        </label>
                        <Select defaultValue="vegetarian">
                          <SelectTrigger className="w-full h-10">
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
                        <label className="text-xs font-semibold text-foreground">
                          Plus-ones
                        </label>
                        <div className="flex h-10 items-center justify-between rounded-md border px-3">
                          <button
                            type="button"
                            onClick={() => setPlusOnes((n) => Math.max(0, n - 1))}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-foreground">
                            {plusOnes}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPlusOnes((n) => Math.min(9, n + 1))}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {songRequest && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-foreground">
                          Song request (optional)
                        </label>
                        <Textarea
                          placeholder="Any song you'd love to dance to?"
                          className="min-h-[60px] resize-none text-sm p-3"
                        />
                      </div>
                    )}

                    {messageToCouple && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-foreground">
                          Message to the couple
                        </label>
                        <Textarea
                          placeholder="Leave a note for the couple"
                          className="min-h-[60px] resize-none text-sm p-3"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-6 mt-auto border-t border-muted">
                    <Button className="w-full h-12 text-base bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md">
                      Yes, I'll be there!
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm text-sm">
                        Maybe
                      </Button>
                      <Button className="w-full h-10 bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-sm text-sm">
                        Can't make it
                      </Button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
