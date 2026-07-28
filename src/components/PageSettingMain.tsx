import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { Button } from "@/components/ui/button";
import {
  useGenerateViewUrl,
  useGetGuestEventInviteFormatsInfinite,
  useUpdateGuestEventInviteFormat,
} from "@/hooks/use-pageSetting";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import { CheckIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getSideBadgeStyles } from "@/components/EventCard";
import PageSettingsGuestList from "@/components/PageSettingsGuestList";
import PageSettingsGuestQuestions from "@/components/PageSettingsGuestQuestions";
import PageSettingsIllustration from "@/components/PageSettingsIllustration";
import PageSettingsReminders from "@/components/PageSettingsReminders";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RsvpSettingsSchema,
  type RsvpSettingsFormValues,
} from "@/validations/pageSetting.validation";
import { Form } from "@/components/ui/form";

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
    defaultValues: {
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
    },
  });

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = events.find((e) => e.id === eventId);
    const format = event?.guestEventInviteFormat?.[0];

    if (format) {
      form.reset({
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
      });
    } else {
      form.reset({
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
      });
    }
  };

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      if (eventParam && events.some(e => e.id === eventParam)) {
        handleSelectEvent(eventParam);
      } else {
        handleSelectEvent(events[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, selectedEventId]);

  const updateFormatMutation = useUpdateGuestEventInviteFormat();

  const handleSaveChanges = form.handleSubmit((data) => {
    if (!selectedFormat?.id) return;
    updateFormatMutation.mutate({ id: selectedFormat.id, data: data });
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const generateViewUrlMutation = useGenerateViewUrl();

  const formValues = form.watch();

  useEffect(() => {
    if (formValues.generated_image) {
      generateViewUrlMutation
        .mutateAsync(formValues.generated_image)
        .then((res) => {
          if (res.data?.url) {
            setGeneratedImage(res.data.url);
          }
        })
        .catch(console.error);
    } else {
      setGeneratedImage(null);
    }
  }, [selectedEventId, formValues.generated_image]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading page settings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load page settings. Please try again.
      </div>
    );
  }

  if (events.length === 0 && data?.pages.length === 1) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No page settings found.
      </div>
    );
  }
  return (
    <Form {...form}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 w-full">
          {events.map((event) => {
            const sideStyles = getSideBadgeStyles(event.event_side as any);
            const isSelected = selectedEventId === event.id;

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
            <Button
              variant="default"
              onClick={handleSaveChanges}
              disabled={updateFormatMutation.isPending}
            >
              {updateFormatMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon className="mr-2 h-4 w-4" />
              )}
              <span>Save Changes</span>
            </Button>
          </div>
        )}
      </div>

      <div
        className="mt-auto grid gap-5 grid-cols-1 lg:grid-cols-3"
        key={selectedEventId}
      >
        <div className="lg:col-span-2">
          <PageSettingsIllustration
            key={selectedEventId}
            eventId={selectedEventId}
            generatedImage={generatedImage}
            setGeneratedImage={(val, key) => {
              setGeneratedImage(val);
              if (key !== undefined) {
                form.setValue("generated_image", key);
              }
            }}
          />

          <PageSettingsGuestQuestions />

          <PageSettingsGuestList
            total={selectedEvent?.stats?.total ?? 0}
            PENDING={selectedEvent?.stats?.PENDING ?? 0}
            ATTENDING={selectedEvent?.stats?.ATTENDING ?? 0}
            DECLINED={selectedEvent?.stats?.DECLINED ?? 0}
            MAYBE={selectedEvent?.stats?.MAYBE ?? 0}
            eventId={selectedEventId}
          />

          <PageSettingsReminders />
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start mt-8 lg:mt-0">
          <RsvpPhonePreview
            event={selectedEvent}
            heroImage={generatedImage}
            dietaryPreference={formValues.dietary_preference}
            plusOnesEnabled={formValues.plus_ones}
            songRequest={formValues.song_request}
            messageToCouple={formValues.message}
          />
        </div>
      </div>
    </Form>
  );
}
