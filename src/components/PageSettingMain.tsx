import NoEventsState from "@/components/NoEventsState";
import Notice from "@/components/Notice";
import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetGuestEventInviteFormatsInfinite,
  useGetViewUrl,
  useUpdateGuestEventInviteFormat,
} from "@/hooks/use-pageSetting";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PageSettingsGuestList from "@/components/PageSettingsGuestList";
import PageSettingsGuestQuestions from "@/components/PageSettingsGuestQuestions";
import PageSettingsIllustration from "@/components/PageSettingsIllustration";
import PageSettingsReminders from "@/components/PageSettingsReminders";
import { cn } from "@/lib/utils";
import {
  formatSide,
  getSideBadgeStyles,
  getSideSelectedStyles,
} from "@/lib/eventSide";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RsvpSettingsSchema,
  type RsvpSettingsFormValues,
} from "@/validations/pageSetting.validation";
import { Form } from "@/components/ui/form";

// The settings column and the phone preview size themselves against the
// content width, not the viewport, so collapsing the sidebar re-lays them out.
const SHELL = "@container/settings";
const SPLIT = "grid gap-5 @min-[64rem]/settings:grid-cols-3";

const EMPTY_SETTINGS: RsvpSettingsFormValues = {
  illustration_theme: null,
  illustration_style: null,
  photo_type: null,
  bride_attire_style: null,
  groom_attire_style: null,
  raw_image: null,
  generated_image: null,
  dietary_preference: false,
  plus_ones: false,
  song_request: false,
  message: false,
  first_reminder: false,
  final_reminder: false,
  rsvp_deadline: null,
};

export default function PageSettingMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetGuestEventInviteFormatsInfinite(activeWeddingId, 5);

  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get("event");

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const selectedFormat = selectedEvent?.guestEventInviteFormat?.[0];

  const form = useForm<RsvpSettingsFormValues>({
    resolver: zodResolver(RsvpSettingsSchema),
    defaultValues: EMPTY_SETTINGS,
  });

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = events.find((e) => e.id === eventId);
    const format = event?.guestEventInviteFormat?.[0];

    form.reset(
      format
        ? {
            illustration_theme: format.illustration_theme || null,
            illustration_style: format.illustration_style || null,
            photo_type: format.photo_type || null,
            bride_attire_style: format.bride_attire_style || null,
            groom_attire_style: format.groom_attire_style || null,
            raw_image: format.raw_image || null,
            generated_image: format.generated_image || null,
            dietary_preference: format.dietary_preference || false,
            plus_ones: format.plus_ones || false,
            song_request: format.song_request || false,
            message: format.message || false,
            first_reminder: format.first_reminder || false,
            final_reminder: format.final_reminder || false,
            // en-CA formats as YYYY-MM-DD, the value a date input expects, in the host's timezone
            rsvp_deadline: format.rsvp_deadline
              ? new Date(format.rsvp_deadline).toLocaleDateString("en-CA")
              : null,
          }
        : EMPTY_SETTINGS,
    );
  };

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      if (eventParam && events.some((e) => e.id === eventParam)) {
        handleSelectEvent(eventParam);
      } else {
        handleSelectEvent(events[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, selectedEventId]);

  const updateFormatMutation = useUpdateGuestEventInviteFormat();

  const handleSaveChanges = form.handleSubmit((values) => {
    if (!selectedFormat?.id) return;
    updateFormatMutation.mutate(
      {
        id: selectedFormat.id,
        data: {
          ...values,
          // RSVPs close at the end of the chosen day in the host's timezone
          rsvp_deadline: values.rsvp_deadline
            ? new Date(`${values.rsvp_deadline}T23:59:59`).toISOString()
            : null,
        },
      },
      // Otherwise the form stays "dirty" after a successful save and the
      // unsaved-changes marker never clears.
      { onSuccess: () => form.reset(values) },
    );
  });

  const formValues = form.watch();
  const isDirty = form.formState.isDirty;

  // Signed view URL for the illustration, cached per S3 key
  const { data: generatedImage = null } = useGetViewUrl(
    formValues.generated_image,
  );

  if (isLoading) {
    return (
      <div className={SHELL}>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {[24, 32, 28].map((w, i) => (
            <Skeleton key={i} className="h-8 rounded-lg" style={{ width: w * 4 }} />
          ))}
          <Skeleton className="ml-auto h-8 w-32 rounded-lg" />
        </div>
        <div className={SPLIT}>
          <div className="space-y-5 @min-[64rem]/settings:col-span-2">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[30rem] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Notice
        title="We couldn't load these settings."
        body="Something went wrong on the way to the server. Refresh the page to try again."
      />
    );
  }

  if (events.length === 0 && data?.pages.length === 1) {
    return (
      <NoEventsState description="Create an event first — its RSVP page is set up here." />
    );
  }

  return (
    <Form {...form}>
      <div className={SHELL}>
        {/* Which event you're editing, and the one button that commits it.
            Sticky, because the settings below it are long enough to scroll
            past — Save used to disappear off the top. */}
        <div className="sticky top-14 z-20 -mx-4 mb-5 border-b border-border bg-background px-4 py-3 sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Scrolls sideways rather than wrapping into a growing pile of
                pills that pushes the settings down the page. */}
            <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5">
              {/* Two things at once, one colour system: the hue is whose side
                  the event is, the fill is whether it's the one you're editing.
                  The old pills used hue for side and opacity + ring + weight
                  for selection, so neither read clearly. */}
              {events.map((event) => {
                const isSelected = selectedEventId === event.id;
                return (
                  <Button
                    key={event.id}
                    size="sm"
                    variant="outline"
                    aria-pressed={isSelected}
                    title={`${event.title} — ${formatSide(event.event_side)}`}
                    className={cn(
                      "shrink-0",
                      isSelected
                        ? getSideSelectedStyles(event.event_side)
                        : getSideBadgeStyles(event.event_side),
                    )}
                    onClick={() => handleSelectEvent(event.id)}
                  >
                    {event.title}
                  </Button>
                );
              })}
              {hasNextPage && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage && <Loader2 className="animate-spin" />}
                  Load more
                </Button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {/* Says out loud that switching events would lose the edits */}
              <span
                className={cn(
                  "hidden text-xs text-muted-foreground @min-[34rem]/settings:inline",
                  !isDirty && "invisible",
                )}
              >
                Unsaved changes
              </span>
              <Button
                onClick={handleSaveChanges}
                loading={updateFormatMutation.isPending}
                disabled={!isDirty}
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>

        <div className={SPLIT} key={selectedEventId}>
          <div className="space-y-5 @min-[64rem]/settings:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Invitation illustration</CardTitle>
                <CardDescription>
                  Turn a photo of the couple into the picture at the top of the
                  RSVP page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageSettingsIllustration
                  eventId={selectedEventId}
                  generatedImage={generatedImage}
                  onGeneratedImageChange={(key) =>
                    form.setValue("generated_image", key, {
                      shouldDirty: true,
                    })
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to ask guests</CardTitle>
                <CardDescription>
                  Everything here is optional. Whatever you turn on appears on
                  the RSVP form, and you can see it in the preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageSettingsGuestQuestions />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deadline and WhatsApp reminders</CardTitle>
                <CardDescription>
                  Reminders go only to guests who haven't replied. When one is
                  due it appears under Send RSVPs on WhatsApp in Guest Preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageSettingsReminders />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Who's invited</CardTitle>
                <CardDescription>
                  Everyone invited to this event, and where their replies stand.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageSettingsGuestList
                  total={selectedEvent?.stats?.total ?? 0}
                  PENDING={selectedEvent?.stats?.PENDING ?? 0}
                  ATTENDING={selectedEvent?.stats?.ATTENDING ?? 0}
                  DECLINED={selectedEvent?.stats?.DECLINED ?? 0}
                  MAYBE={selectedEvent?.stats?.MAYBE ?? 0}
                  eventId={selectedEventId}
                />
              </CardContent>
            </Card>
          </div>

          <div className="@min-[64rem]/settings:sticky @min-[64rem]/settings:top-32 @min-[64rem]/settings:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Live preview</CardTitle>
                <CardDescription>
                  What a guest sees when they open their link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RsvpPhonePreview
                  event={selectedEvent}
                  heroImage={generatedImage}
                  dietaryPreference={formValues.dietary_preference}
                  plusOnesEnabled={formValues.plus_ones}
                  songRequest={formValues.song_request}
                  messageToCouple={formValues.message}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Form>
  );
}
