import { aiInviteCardService, type GenerateAIInviteCardError } from "@/api/aiInviteCard.service";
import { generalService } from "@/api/general.service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  AI_INVITE_CARD_QUERY_KEY,
  useAiInviteCardGenerationStatus,
  useGetAiInviteCardsByWeddingInfinite,
  useUpdateAiInviteCard,
} from "@/hooks/use-aiInviteCard";
import { activeWeddingIdAtom } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Loader2, SparklesIcon, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import toast from "react-hot-toast";

// Sub-components
import EventSelectorBar from "./EventSelectorBar";
import NoEventsState from "./NoEventsState";
import DesignConfigForm from "./DesignConfigForm";
import ReferenceUploadForm from "./ReferenceUploadForm";
import CustomMessageForm from "./CustomMessageForm";
import CharacterPhotoForm from "./CharacterPhotoForm";
import DesignPreviewCard from "./DesignPreviewCard";
import { aiInviteFormSchema, type AiInviteFormValues } from "@/validations/aiInviteCard.validation";
import {
  IN_FLIGHT_GENERATION_STATUSES,
  type AiEventInviteCard,
} from "@/models/aiInviteCard.model";


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

  const photoType: AiInviteFormValues["photoType"] = card.photo_type || "couple";
  const isCouple = photoType === "couple";

  return {
    activeTab: card.generation_mode === "EXAMPLE" ? "upload" : "describe",
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

export default function AiCardInviteMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetAiInviteCardsByWeddingInfinite(activeWeddingId);

  // Each page returns events with their AI invite card, so cards load page-by-page alongside events
  const events = useMemo(
    () => data?.pages.flatMap((page) => page.data?.events || []) || [],
    [data],
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(
    events?.[0]?.id || ""
  );

  const selectedCard = events.find((event) => event.id === selectedEventId)
    ?.aiEventInviteCard?.[0];

  const updateMutation = useUpdateAiInviteCard();

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploadingReference, setIsUploadingReference] = useState(false);

  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [isUploadingCharacter, setIsUploadingCharacter] = useState(false);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<GenerateAIInviteCardError | null>(null);

  const form = useForm<AiInviteFormValues>({
    resolver: zodResolver(aiInviteFormSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  // Hydrate the form when the user switches events — not on every refetch,
  // which would discard edits made since the last save.
  const hydratedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedEventId || hydratedEventIdRef.current === selectedEventId) return;

    hydratedEventIdRef.current = selectedEventId;
    form.reset(cardToFormValues(selectedCard));
    setGenerationError(null);
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
  }, [selectedEventId, generatedImageKey, referenceImageKey, characterImageKey]);

  const activeTab = form.watch("activeTab");

  // A run started before a reload is still recorded on the card, so the page rejoins it
  const [pollingCardId, setPollingCardId] = useState<string | null>(null);

  const cardHasRunInFlight =
    !!selectedCard?.generation_status &&
    IN_FLIGHT_GENERATION_STATUSES.includes(selectedCard.generation_status);

  const { data: statusResponse } = useAiInviteCardGenerationStatus(
    selectedCard?.id ?? null,
    cardHasRunInFlight || (!!selectedCard?.id && pollingCardId === selectedCard.id),
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
      generation_mode: (formData.activeTab === "describe"
        ? "MANUAL"
        : "EXAMPLE") as "MANUAL" | "EXAMPLE",
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
        ? emptyToNull(isCouple ? formData.brideAttireStyle : formData.singleAttireStyle)
        : null,
      groom_attire_style: composesNewPortrait
        ? emptyToNull(isCouple ? formData.groomAttireStyle : formData.singleAttireStyle)
        : null,
    };
  };

  const generateMutation = useMutation({
    onMutate: () => {
      setGenerationError(null);
    },
    mutationFn: async (formData: AiInviteFormValues) => {
      const { photo_type, ...config } = buildCardPayload(formData);

      return aiInviteCardService.generateAIInviteCardImage({
        eventId: selectedEventId,
        ...config,
        photo_type: photo_type ?? undefined,
      });
    },
    onSuccess: (res) => {
      // The worker does the generating; follow it through the status endpoint
      setPollingCardId(res.data.aiInviteCardId);
      queryClient.invalidateQueries({ queryKey: [...AI_INVITE_CARD_QUERY_KEY] });
      toast.success("Generating your invitation — you can leave this page.");
    },
    onError: (error: Error & { status?: number; type?: string }) => {
      console.error("Failed to start generation", error);

      // 409 means a run is already in flight for this card, so follow that one instead
      if (error?.status === 409 && selectedCard?.id) {
        setPollingCardId(selectedCard.id);
        return;
      }

      const type = error?.type;
      if (type === "transient" || type === "timeout" || type === "permanent") {
        setGenerationError({ type, message: error.message });
      } else {
        setGenerationError({ type: "permanent", message: error?.message || "An unexpected error occurred." });
      }

      toast.error("Failed to start generation.");
    }
  });

  const isGenerating =
    generateMutation.isPending ||
    cardHasRunInFlight ||
    (!!generationStatus &&
      generationStatus.id === selectedCard?.id &&
      IN_FLIGHT_GENERATION_STATUSES.includes(generationStatus.status));

  // Report a finished run once — polling stops as soon as the status settles
  const settledGenerationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!generationStatus) return;
    if (IN_FLIGHT_GENERATION_STATUSES.includes(generationStatus.status)) return;

    const settledKey = `${generationStatus.id}:${generationStatus.status}:${generationStatus.completed_at ?? ""}`;
    if (settledGenerationRef.current === settledKey) return;
    settledGenerationRef.current = settledKey;

    setPollingCardId(null);

    if (generationStatus.status === "COMPLETED") {
      setGenerationError(null);
      toast.success("Invitation generated successfully!");
      // Refresh the card so the new image key flows into the preview effect
      queryClient.invalidateQueries({ queryKey: [...AI_INVITE_CARD_QUERY_KEY] });
    }

    if (generationStatus.status === "FAILED") {
      setGenerationError({
        type: "transient",
        message: generationStatus.error || "Generation failed. Please try again.",
      });
      toast.error("Failed to generate invitation.");
    }
  }, [generationStatus, queryClient]);

  const onSubmit = (data: AiInviteFormValues) => {
    generateMutation.mutate(data);
  };

  const handleSaveChanges = () => {
    if (!selectedCard?.id) {
      toast.error("No card configuration found to update for this event.");
      return;
    }
    updateMutation.mutate({
      id: selectedCard.id,
      data: buildCardPayload(form.getValues()),
    });
  };

  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
      setIsUploadingReference(true);
      try {
        const objectKey = `ai-invite-cards/raw-images/invitation-reference/${Date.now()}-${file.name}`;
        const urlRes = await generalService.generateUploadUrl(objectKey, file.type);
        await generalService.uploadFileToS3(urlRes.data.url, file);
        form.setValue("referenceKey", urlRes.data.object_key, { shouldValidate: true });
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to upload reference image.");
      } finally {
        setIsUploadingReference(false);
      }
    }
  };

  const handleCharacterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCharacterImage(URL.createObjectURL(file));
      setIsUploadingCharacter(true);
      try {
        const objectKey = `ai-invite-cards/raw-images/invitation-character/${Date.now()}-${file.name}`;
        const urlRes = await generalService.generateUploadUrl(objectKey, file.type);
        await generalService.uploadFileToS3(urlRes.data.url, file);
        form.setValue("characterKey", urlRes.data.object_key, { shouldValidate: true });
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
      <div className="flex flex-col gap-4">
        {/* Top bar skeletons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Layout skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-start">
          <div className="space-y-4 md:col-span-6 lg:col-span-6">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="md:col-span-6 lg:col-span-6">
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
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
        <EventSelectorBar
          events={events}
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isGenerating={updateMutation.isPending}
          onGenerate={handleSaveChanges}
          isUploadingReference={isUploadingReference}
          isUploadingCharacter={isUploadingCharacter}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-start">
          {/* Left Column: Form Controls */}
          <div className="space-y-4 md:col-span-7 lg:col-span-8">
            <div className="mb-2">
              <h3 className="text-xl font-semibold">AI Invitation Card Builder</h3>
              <p className="text-sm text-muted-foreground">
                Select an event to generate a beautiful AI-powered luxury invitation card.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => form.setValue("activeTab", v as "describe" | "upload")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="describe" className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Describe with AI
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <UploadIcon className="w-4 h-4" />
                  Upload Example
                </TabsTrigger>
              </TabsList>

              <TabsContent value="describe" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                <DesignConfigForm />
              </TabsContent>

              <TabsContent value="upload" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                <ReferenceUploadForm
                  uploadedImage={uploadedImage}
                  isUploadingReference={isUploadingReference}
                  handleReferenceUpload={handleReferenceUpload}
                  onRemoveImage={() => {
                    setUploadedImage(null);
                    form.setValue("referenceKey", null, { shouldValidate: true });
                  }}
                />
              </TabsContent>
            </Tabs>

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

            {/* Global Action Button */}
            <div className="pt-4">
              <Button
                size="lg"
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={
                  isGenerating ||
                  !selectedEventId ||
                  isUploadingReference ||
                  isUploadingCharacter
                }
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 gap-2 group rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {activeTab === "describe" ? "Generate Luxury Invitation" : "Generate from Reference Image"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 h-full flex justify-center items-start">
            <div className="w-full max-w-sm lg:max-w-none md:sticky md:top-6">
              <DesignPreviewCard
              isGenerating={isGenerating}
              generationStage={generationStatus?.stage ?? selectedCard?.generation_stage ?? null}
              generatedImageUrl={generatedImageUrl}
              error={generationError}
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
