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

import { getSideBadgeStyles } from "@/components/EventCard";
import PageSettingsGuestList from "@/components/PageSettingsGuestList";
import PageSettingsGuestQuestions from "@/components/PageSettingsGuestQuestions";
import PageSettingsIllustration from "@/components/PageSettingsIllustration";
import PageSettingsReminders from "@/components/PageSettingsReminders";
import { cn } from "@/lib/utils";

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
  const [localFormats, setLocalFormats] = useState<Record<string, any>>({});

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const selectedFormat = selectedEvent?.guestEventInviteFormat?.[0];
  const activeFormat = selectedEventId
    ? { ...selectedFormat, ...localFormats[selectedEventId] }
    : selectedFormat;

  const handleFormatToggle = (key: string, value: any) => {
    if (!selectedEventId) return;
    setLocalFormats((prev) => ({
      ...prev,
      [selectedEventId]: {
        ...(prev[selectedEventId] || {}),
        [key]: value,
      },
    }));
  };

  const updateFormatMutation = useUpdateGuestEventInviteFormat();

  const handleSaveChanges = () => {
    if (!selectedFormat?.id || !selectedEventId) return;
    const payload = {
      ...selectedFormat,
      ...(localFormats[selectedEventId] || {}),
    };
    if (payload && Object.keys(payload).length > 0) {
      updateFormatMutation.mutate({ id: selectedFormat.id, data: payload });
    }
  };

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const generateViewUrlMutation = useGenerateViewUrl();

  useEffect(() => {
    if (activeFormat?.generated_image) {
      generateViewUrlMutation
        .mutateAsync(activeFormat.generated_image)
        .then((res) => {
          if (res.data?.url) {
            setGeneratedImage(res.data.url);
          }
        })
        .catch(console.error);
    } else {
      setGeneratedImage(null);
    }
  }, [selectedEventId, activeFormat?.generated_image]);

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
    <>
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
                onClick={() => setSelectedEventId(event.id)}
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

      <div className="mt-auto grid gap-5 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageSettingsIllustration
            key={selectedEventId}
            eventId={selectedEventId}
            generatedImage={generatedImage}
            setGeneratedImage={(val, key) => {
              setGeneratedImage(val);
              if (key !== undefined) {
                handleFormatToggle("generated_image", key);
              }
            }}
            rawImageKey={activeFormat?.raw_image || null}
            setRawImageKey={(key) => handleFormatToggle("raw_image", key)}
            activeFormat={activeFormat}
            handleFormatToggle={handleFormatToggle}
          />

          <PageSettingsGuestQuestions
            activeFormat={activeFormat}
            handleFormatToggle={handleFormatToggle}
          />

          <PageSettingsGuestList />

          <PageSettingsReminders
            activeFormat={activeFormat}
            handleFormatToggle={handleFormatToggle}
          />
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start mt-8 lg:mt-0">
          <RsvpPhonePreview
            event={selectedEvent}
            heroImage={generatedImage}
            dietaryPreference={activeFormat?.dietary_preference}
            plusOnesEnabled={activeFormat?.plus_ones}
            songRequest={activeFormat?.song_request}
            messageToCouple={activeFormat?.message}
          />
        </div>
      </div>
    </>
  );
}
