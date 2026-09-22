import {
  inviteCardService,
  type GenerateInviteCardError,
} from "@/api/inviteCard.service";
import { generalService } from "@/api/general.service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  invalidateInviteCards,
  useInviteCardGenerationStatus,
  useGetInviteCardsByWeddingInfinite,
  useUpdateInviteCard,
} from "@/hooks/use-inviteCard";
import { activeWeddingIdAtom } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { CheckIcon, ImageIcon, SparklesIcon, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import toast from "react-hot-toast";

// Sub-components
import { cn } from "@/lib/utils";
import EventBar from "./EventBar";
import NoEventsState from "./NoEventsState";
import DesignConfigForm from "./DesignConfigForm";
import ReferenceUploadForm from "./ReferenceUploadForm";
import CustomMessageForm from "./CustomMessageForm";
import CharacterPhotoForm from "./CharacterPhotoForm";
import DesignPreviewCard from "./DesignPreviewCard";
import OwnCardUploadForm from "./OwnCardUploadForm";
import {
  aiInviteFormSchema,
  type AiInviteFormValues,
} from "@/validations/inviteCard.validation";
import {
  IN_FLIGHT_GENERATION_STATUSES,
  type AiEventInviteCard,
} from "@/models/inviteCard.model";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

// The form column and the preview size themselves against the content width,
// not the viewport, so collapsing the sidebar re-lays them out. Same split as
// the RSVP page settings, which is the same shape of page.
const SHELL = "@container/invite";
const SPLIT = "grid gap-5 @min-[64rem]/invite:grid-cols-3";

// The generator can't read HEIC and skips sources over 20 MB, so stop those before uploading
const rejectUnsupportedImage = (file: File) => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Upload a JPG, PNG or WebP image.");
    return true;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    toast.error("Images must be 20 MB or smaller.");
    return true;
  }

  return false;
};

const EMPTY_FORM_VALUES: AiInviteFormValues = {
  activeTab: "describe",
  designPreset: "",
  textureEmulation: "",
  typographyPairing: "",
  metallicAccents: "",
  negativeSpace: "",
  monogramStyle: "",
  textAlignment: "",
  edgeStyling: "",
  additionalDetails: "",
  customMessage: "",
  referenceKey: null,
  characterKey: null,
  photoType: "couple",
  photoPlacement: null,
  illustrationStyle: null,
  brideAttireStyle: "",
  groomAttireStyle: "",
  singleAttireStyle: "",
};

const cardToFormValues = (
  card?: AiEventInviteCard | null,
): AiInviteFormValues => {
  if (!card) return EMPTY_FORM_VALUES;

  const photoType: AiInviteFormValues["photoType"] =
    card.photo_type || "couple";
  const isCouple = photoType === "couple";

  return {
    activeTab: card.card_source === "EXAMPLE" ? "upload" : "describe",
    designPreset: card.design_preset || "",
    textureEmulation: card.texture_emulation || "",
    typographyPairing: card.typography_pairing || "",
    metallicAccents: card.metallic_accents || "",
    negativeSpace: card.negative_space || "",
    monogramStyle: card.monogram_style || "",
    textAlignment: card.text_alignment || "",
    edgeStyling: card.edge_styling || "",
    additionalDetails: card.additional_details || "",
    customMessage: card.custom_message || "",
    referenceKey: card.reference_image || null,
    characterKey: card.couple_raw_image_key || null,
    photoType,
    photoPlacement: card.photo_placement || null,
    illustrationStyle: card.illustration_style || null,
    brideAttireStyle: isCouple ? card.bride_attire_style || "" : "",
    groomAttireStyle: isCouple ? card.groom_attire_style || "" : "",
    singleAttireStyle: isCouple
      ? ""
      : card.bride_attire_style || card.groom_attire_style || "",
  };
};

const emptyToNull = (value?: string | null) => (value ? value : null);

export default function InviteCardMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetInviteCardsByWeddingInfinite(activeWeddingId);

  // Each page returns events with their AI invite card, so cards load page-by-page alongside events
  const events = useMemo(
    () => data?.pages.flatMap((page) => page.data?.events || []) || [],
    [data],
  );

  // Guest Preview sends the event it was showing in navigation state rather
  // than a query string, so the URL stays /invite-card.
  const requestedEventId = (useLocation().state as { eventId?: string } | null)
    ?.eventId;

  const [selectedEventId, setSelectedEventId] = useState<string>(
    events?.[0]?.id || "",
  );

  const selectedCard = events.find((event) => event.id === selectedEventId)
    ?.inviteCard?.[0];

  const updateMutation = useUpdateInviteCard();

  // Applied once, as soon as there are events to choose from — not guarded by
  // "no selection yet", because a cached list means selectedEventId is already
  // the first event by the time this runs, which is what swallowed the
  // requested event before.
  const appliedRequestRef = useRef(false);

  useEffect(() => {
    if (events.length === 0 || appliedRequestRef.current) return;
    appliedRequestRef.current = true;

    const wanted = events.find((event) => event.id === requestedEventId);
    setSelectedEventId(wanted?.id ?? selectedEventId ?? events[0].id);
  }, [events, selectedEventId, requestedEventId]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploadingReference, setIsUploadingReference] = useState(false);

  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [isUploadingCharacter, setIsUploadingCharacter] = useState(false);

  const [isUploadingCard, setIsUploadingCard] = useState(false);
  // Which tab is showing Use my own card. Kept outside the form (whose
  // activeTab only knows the two generating tabs) and saved as card_source.
  const [useOwnCard, setUseOwnCard] = useState(false);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [generationError, setGenerationError] =
    useState<GenerateInviteCardError | null>(null);

  const form = useForm<AiInviteFormValues>({
    resolver: zodResolver(aiInviteFormSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  // Hydrate the form when the user switches events — not on every refetch,
  // which would discard edits made since the last save.
  const hydratedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedEventId || hydratedEventIdRef.current === selectedEventId)
      return;

    hydratedEventIdRef.current = selectedEventId;
    form.reset(cardToFormValues(selectedCard));
    setGenerationError(null);
    // Reopen on the tab the card came from, now that the database records it
    setUseOwnCard(selectedCard?.card_source === "UPLOAD");
  }, [selectedEventId, selectedCard, form]);

  const generatedImageKey = selectedCard?.generated_invite_image_url ?? null;
  const referenceImageKey = selectedCard?.reference_image ?? null;
  const characterImageKey = selectedCard?.couple_raw_image_key ?? null;

  // Images are stored as S3 object keys, so each needs a signed view URL before it can be rendered
  useEffect(() => {
    let cancelled = false;

    const resolveViewUrl = async (objectKey: string | null) => {
      if (!objectKey) return null;
      try {
        const res = await generalService.generateViewUrl(objectKey);
        return res.data.url;
      } catch (error) {
        console.error("Failed to generate view URL", error);
        return null;
      }
    };

    (async () => {
      const [generated, reference, character] = await Promise.all([
        resolveViewUrl(generatedImageKey),
        resolveViewUrl(referenceImageKey),
        resolveViewUrl(characterImageKey),
      ]);

      if (cancelled) return;

      setGeneratedImageUrl(generated);
      setUploadedImage(reference);
      setCharacterImage(character);
    })();

    return () => {
      cancelled = true;
    };
    // selectedEventId is a dependency so switching events also clears previews of
    // images that were uploaded but not yet saved.
  }, [
    selectedEventId,
    generatedImageKey,
    referenceImageKey,
    characterImageKey,
  ]);

  const activeTab = form.watch("activeTab");

  // A run started before a reload is still recorded on the card, so the page rejoins it
  const [pollingCardId, setPollingCardId] = useState<string | null>(null);

  const cardHasRunInFlight =
    !!selectedCard?.generation_status &&
    IN_FLIGHT_GENERATION_STATUSES.includes(selectedCard.generation_status);

  const { data: statusResponse } = useInviteCardGenerationStatus(
    selectedCard?.id ?? null,
    cardHasRunInFlight ||
      (!!selectedCard?.id && pollingCardId === selectedCard.id),
  );

  const generationStatus = statusResponse?.data;

  // The card configuration sent to both the save and the generate endpoints
  const buildCardPayload = (formData: AiInviteFormValues) => {
    const hasPhoto = !!formData.characterKey;
    const isCouple = formData.photoType === "couple";
    const composesNewPortrait =
      hasPhoto &&
      (formData.activeTab === "describe" ||
        formData.photoPlacement === "FRAMED_INSET");

    return {
      card_source: (formData.activeTab === "describe"
        ? "PRESETS"
        : "EXAMPLE") as "PRESETS" | "EXAMPLE",
      photo_type: hasPhoto ? formData.photoType : null,
      design_preset: emptyToNull(formData.designPreset),
      texture_emulation: emptyToNull(formData.textureEmulation),
      typography_pairing: emptyToNull(formData.typographyPairing),
      metallic_accents: emptyToNull(formData.metallicAccents),
      negative_space: emptyToNull(formData.negativeSpace),
      monogram_style: emptyToNull(formData.monogramStyle),
      text_alignment: emptyToNull(formData.textAlignment),
      edge_styling: emptyToNull(formData.edgeStyling),
      additional_details: emptyToNull(formData.additionalDetails),
      custom_message: emptyToNull(formData.customMessage),
      // Keep the uploaded example whichever tab is active — the generation mode
      // decides whether it gets used, so saving from the other tab must not erase it.
      reference_image: formData.referenceKey || null,
      couple_raw_image_key: formData.characterKey || null,
      // Describing a design from scratch always composes a fresh portrait; only a
      // reference design can already contain figures to swap faces onto.
      photo_placement: !hasPhoto
        ? null
        : formData.activeTab === "describe"
          ? "FRAMED_INSET"
          : formData.photoPlacement || null,
      // A face swap keeps the example's own outfits and art style, so these only
      // apply when a new portrait is composed.
      illustration_style: composesNewPortrait
        ? formData.illustrationStyle || null
        : null,
      bride_attire_style: composesNewPortrait
        ? emptyToNull(
            isCouple ? formData.brideAttireStyle : formData.singleAttireStyle,
          )
        : null,
      groom_attire_style: composesNewPortrait
        ? emptyToNull(
            isCouple ? formData.groomAttireStyle : formData.singleAttireStyle,
          )
        : null,
    };
  };

  const generateMutation = useMutation({
    onMutate: () => {
      setGenerationError(null);
    },
    mutationFn: async (formData: AiInviteFormValues) => {
      const { photo_type, ...config } = buildCardPayload(formData);

      return inviteCardService.generateInviteCardImage({
        eventId: selectedEventId,
        ...config,
        photo_type: photo_type ?? undefined,
      });
    },
    onSuccess: (res, formData) => {
      // The generate endpoint stores the configuration it was given, so this
      // is a save too — rebase the form or it stays marked unsaved.
      form.reset(formData);
      // The worker does the generating; follow it through the status endpoint
      setPollingCardId(res.data.inviteCardId);
      invalidateInviteCards(queryClient);
      toast.success("Generating your invitation — you can leave this page.");
    },
    onError: (error: Error & { status?: number }) => {
      console.error("Failed to start generation", error);

      // 409 means a run is already in flight for this card, so follow that one instead
      if (error?.status === 409 && selectedCard?.id) {
        setPollingCardId(selectedCard.id);
        return;
      }

      setGenerationError({ code: "UNKNOWN" });
      toast.error("Failed to start generation.");
    },
  });

  const isGenerating =
    generateMutation.isPending ||
    cardHasRunInFlight ||
    (!!generationStatus &&
      generationStatus.id === selectedCard?.id &&
      IN_FLIGHT_GENERATION_STATUSES.includes(generationStatus.status));

  // A failed attempt with more to come leaves its error code on the still in-flight status
  const retrying =
    isGenerating &&
    !!generationStatus &&
    generationStatus.id === selectedCard?.id &&
    IN_FLIGHT_GENERATION_STATUSES.includes(generationStatus.status) &&
    generationStatus.error_code &&
    generationStatus.attempt
      ? {
          attempt: generationStatus.attempt,
          maxAttempts: generationStatus.max_attempts,
        }
      : null;

  // Report a finished run once — polling stops as soon as the status settles
  const settledGenerationRef = useRef<string | null>(null);
  // A run that was already over when this page mounted is history, not news: announcing it
  // would toast again on every visit back to the page.
  const watchedRunRef = useRef(false);

  useEffect(() => {
    if (!generationStatus) return;

    if (IN_FLIGHT_GENERATION_STATUSES.includes(generationStatus.status)) {
      watchedRunRef.current = true;
      return;
    }

    const settledKey = `${generationStatus.id}:${generationStatus.status}:${generationStatus.completed_at ?? ""}`;
    if (settledGenerationRef.current === settledKey) return;
    settledGenerationRef.current = settledKey;

    setPollingCardId(null);
    // Refresh the card either way: it still holds the in-flight status this page reads to
    // decide whether a run is going, and on success the new image key feeds the preview.
    invalidateInviteCards(queryClient);

    if (generationStatus.status === "COMPLETED") setGenerationError(null);
    if (generationStatus.status === "FAILED")
      setGenerationError({ code: generationStatus.error_code ?? "UNKNOWN" });

    if (!watchedRunRef.current) return;
    watchedRunRef.current = false;

    if (generationStatus.status === "COMPLETED")
      toast.success("Invitation generated successfully!");
    if (generationStatus.status === "FAILED")
      toast.error("Failed to generate invitation.");
  }, [generationStatus, queryClient]);

  const onSubmit = (data: AiInviteFormValues) => {
    generateMutation.mutate(data);
  };

  const handleSaveChanges = () => {
    if (!selectedCard?.id) {
      toast.error("No card configuration found to update for this event.");
      return;
    }

    const values = form.getValues();

    updateMutation.mutate(
      {
        id: selectedCard.id,
        data: {
          ...buildCardPayload(values),
          // Saving from Use my own card records that as the card's source; the
          // design settings from the other tabs are still kept alongside it
          ...(useOwnCard && { card_source: "UPLOAD" }),
        },
      },
      // What was saved is the new baseline. Without this the form stays
      // "dirty" after a successful save and the unsaved-changes marker never
      // clears — the hydrating effect below only runs on an event switch.
      { onSuccess: () => form.reset(values) },
    );
  };

  const handleReferenceUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (rejectUnsupportedImage(file)) {
        e.target.value = "";
        return;
      }

      setUploadedImage(URL.createObjectURL(file));
      setIsUploadingReference(true);
      try {
        const objectKey = `ai-invite-cards/raw-images/invitation-reference/${Date.now()}-${file.name}`;
        const urlRes = await generalService.generateUploadUrl(
          objectKey,
          file.type,
        );
        await generalService.uploadFileToS3(urlRes.data.url, file);
        form.setValue("referenceKey", urlRes.data.object_key, {
          shouldValidate: true,
        });
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to upload reference image.");
      } finally {
        setIsUploadingReference(false);
      }
    }
  };

  // For couples who already have an invitation: it becomes the event's card
  // exactly as a generated one would, so Guest Preview and WhatsApp pick it up.
  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // so choosing the same file again still fires
    if (!file || !selectedCard?.id) return;
    if (rejectUnsupportedImage(file)) return;

    const cardId = selectedCard.id;
    const previousUrl = generatedImageUrl;
    setGeneratedImageUrl(URL.createObjectURL(file));
    setGenerationError(null);
    setIsUploadingCard(true);
    try {
      const objectKey = `ai-invite-cards/uploaded/${Date.now()}-${file.name}`;
      const urlRes = await generalService.generateUploadUrl(
        objectKey,
        file.type,
      );
      await generalService.uploadFileToS3(urlRes.data.url, file);
      // Only the image: sending the whole form here would quietly save any
      // unsaved design edits along with it.
      await inviteCardService.updateInviteCard(cardId, {
        generated_invite_image_url: urlRes.data.object_key,
        card_source: "UPLOAD",
      });
      invalidateInviteCards(queryClient);
      toast.success("Invitation uploaded.");
    } catch (err) {
      console.error("Card upload failed", err);
      setGeneratedImageUrl(previousUrl);
      toast.error("Failed to upload your invitation.");
    } finally {
      setIsUploadingCard(false);
    }
  };

  const handleCharacterUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (rejectUnsupportedImage(file)) {
        e.target.value = "";
        return;
      }

      setCharacterImage(URL.createObjectURL(file));
      setIsUploadingCharacter(true);
      try {
        const objectKey = `ai-invite-cards/raw-images/invitation-character/${Date.now()}-${file.name}`;
        const urlRes = await generalService.generateUploadUrl(
          objectKey,
          file.type,
        );
        await generalService.uploadFileToS3(urlRes.data.url, file);
        form.setValue("characterKey", urlRes.data.object_key, {
          shouldValidate: true,
        });
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to upload character photo.");
      } finally {
        setIsUploadingCharacter(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={SHELL}>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {[24, 32, 28].map((w, i) => (
            <Skeleton
              key={i}
              className="h-8 rounded-lg"
              style={{ width: w * 4 }}
            />
          ))}
          <Skeleton className="ml-auto h-8 w-32 rounded-lg" />
        </div>
        <div className={SPLIT}>
          <div className="space-y-5 @min-[64rem]/invite:col-span-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[30rem] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (events.length === 0 && data?.pages?.length === 1) {
    return (
      <NoEventsState description="Create an event to design its invitation card." />
    );
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <div className={SHELL}>
          <EventBar
            events={events}
            selectedId={selectedEventId}
            onSelect={setSelectedEventId}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            {/* Says out loud that switching events would lose the edits */}
            <span
              className={cn(
                "hidden text-xs text-muted-foreground @min-[26rem]/eventbar:inline",
                !form.formState.isDirty && "invisible",
              )}
            >
              Unsaved changes
            </span>
            <Button
              type="button"
              onClick={handleSaveChanges}
              aria-label="Save changes"
              loading={updateMutation.isPending}
              disabled={
                !selectedEventId ||
                isUploadingReference ||
                isUploadingCharacter
              }
            >
              <CheckIcon />
              <span className="hidden @min-[26rem]/eventbar:inline">
                Save changes
              </span>
            </Button>
          </EventBar>

          <div className={SPLIT}>
            {/* Left: how the card should look */}
            <div className="space-y-5 @min-[64rem]/invite:col-span-2">
              <Tabs
                value={useOwnCard ? "own" : activeTab}
                onValueChange={(v) => {
                  setUseOwnCard(v === "own");
                  if (v !== "own")
                    form.setValue("activeTab", v as "describe" | "upload");
                }}
              >
                {/* Three tabs have to fit a phone. The triggers are
                    whitespace-nowrap, so full labels overflowed their third of
                    the row rather than shrinking: below ~34rem of content width
                    they drop to one word each, and the icons go at the very
                    narrowest, where even those need the room. */}
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="describe" className="min-w-0">
                    <SparklesIcon className="hidden @min-[22rem]/invite:block" />
                    <span className="truncate @max-[34rem]/invite:hidden">
                      Describe a design
                    </span>
                    <span className="truncate @min-[34rem]/invite:hidden">
                      Describe
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="min-w-0">
                    <ImageIcon className="hidden @min-[22rem]/invite:block" />
                    <span className="truncate @max-[34rem]/invite:hidden">
                      Use an example
                    </span>
                    <span className="truncate @min-[34rem]/invite:hidden">
                      Example
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="own" className="min-w-0">
                    <UploadIcon className="hidden @min-[22rem]/invite:block" />
                    <span className="truncate @max-[34rem]/invite:hidden">
                      Use my own card
                    </span>
                    <span className="truncate @min-[34rem]/invite:hidden">
                      My card
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="describe"
                  className="mt-5 focus-visible:outline-none"
                >
                  <DesignConfigForm />
                </TabsContent>

                <TabsContent
                  value="upload"
                  className="mt-5 focus-visible:outline-none"
                >
                  <ReferenceUploadForm
                    uploadedImage={uploadedImage}
                    isUploadingReference={isUploadingReference}
                    handleReferenceUpload={handleReferenceUpload}
                    onRemoveImage={() => {
                      setUploadedImage(null);
                      form.setValue("referenceKey", null, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </TabsContent>

                <TabsContent
                  value="own"
                  className="mt-5 focus-visible:outline-none"
                >
                  <OwnCardUploadForm
                    onUpload={handleCardUpload}
                    isUploading={isUploadingCard}
                    hasCard={!!generatedImageUrl}
                    isGenerating={isGenerating}
                    disabled={!selectedCard?.id}
                  />
                </TabsContent>
              </Tabs>

              {/* Message, couple photo and Generate only shape a generated
                  card; with your own card there's nothing for them to do. */}
              {!useOwnCard && (
                <>
                  <CustomMessageForm />

                  <CharacterPhotoForm
                    characterImage={characterImage}
                    isUploadingCharacter={isUploadingCharacter}
                    handleCharacterUpload={handleCharacterUpload}
                    onRemoveImage={() => {
                      setCharacterImage(null);
                      form.setValue("characterKey", null, { shouldValidate: true });
                    }}
                  />

                  {/* Save changes keeps the configuration; this is the one that
                      spends a generation, so it stays the page's only filled
                      full-width button. */}
                  <Button
                    type="button"
                    className="w-full"
                    onClick={form.handleSubmit(onSubmit)}
                    loading={isGenerating}
                    disabled={
                      !selectedEventId ||
                      isUploadingReference ||
                      isUploadingCharacter ||
                      isUploadingCard
                    }
                  >
                    {!isGenerating && <SparklesIcon />}
                    {isGenerating
                      ? "Generating…"
                      : activeTab === "describe"
                        ? "Generate invitation"
                        : "Generate from example"}
                  </Button>
                </>
              )}
            </div>

            {/* Right: what came back */}
            <div className="@min-[64rem]/invite:sticky @min-[64rem]/invite:top-32 @min-[64rem]/invite:self-start">
              <DesignPreviewCard
                isUploading={isUploadingCard}
                isGenerating={isGenerating}
                generationStage={
                  generationStatus?.stage ??
                  selectedCard?.generation_stage ??
                  null
                }
                generatedImageUrl={generatedImageUrl}
                error={generationError}
                retrying={retrying}
                onRetry={() => {
                  setGenerationError(null);
                  form.handleSubmit(onSubmit)();
                }}
              />
            </div>
          </div>
        </div>
      </Form>
    </TooltipProvider>
  );
}
