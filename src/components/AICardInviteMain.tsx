import { aiInviteCardService, type GenerateAIInviteCardError } from "@/api/aiInviteCard.service";
import { generalService } from "@/api/general.service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetGuestEventInviteFormatsInfinite } from "@/hooks/use-pageSetting";
import { activeWeddingIdAtom } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Loader2, SparklesIcon, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import toast from "react-hot-toast";

// Sub-components
import EventSelectorBar from "./EventSelectorBar";
import DesignConfigForm from "./DesignConfigForm";
import ReferenceUploadForm from "./ReferenceUploadForm";
import CustomMessageForm from "./CustomMessageForm";
import CharacterPhotoForm from "./CharacterPhotoForm";
import DesignPreviewCard from "./DesignPreviewCard";
import { aiInviteFormSchema, type AiInviteFormValues } from "@/validations/aiInviteCard.validation";


export default function AiCardInviteMain() {
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetGuestEventInviteFormatsInfinite(activeWeddingId, 5);

  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];

  const [selectedEventId, setSelectedEventId] = useState<string>(
    events?.[0]?.id || ""
  );

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
    defaultValues: {
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
      illustrationStyle: null,
      brideAttireStyle: "",
      groomAttireStyle: "",
      singleAttireStyle: "",
    },
  });

  const activeTab = form.watch("activeTab");

  const generateMutation = useMutation({
    onMutate: () => {
      setGenerationError(null);
    },
    mutationFn: async (formData: AiInviteFormValues) => {
      return aiInviteCardService.generateAIInviteCardImage({
        eventId: selectedEventId,
        generation_mode: formData.activeTab === "describe" ? "MANUAL" : "EXAMPLE",
        photo_type: formData.characterKey ? formData.photoType : undefined,
        design_preset: formData.designPreset,
        texture_emulation: formData.textureEmulation,
        typography_pairing: formData.typographyPairing,
        metallic_accents: formData.metallicAccents,
        negative_space: formData.negativeSpace,
        monogram_style: formData.monogramStyle,
        text_alignment: formData.textAlignment,
        edge_styling: formData.edgeStyling,
        additional_details: formData.additionalDetails,
        custom_message: formData.customMessage,
        reference_image: formData.activeTab === "upload" ? formData.referenceKey : null,
        couple_raw_image_key: formData.characterKey,
        illustration_style: formData.illustrationStyle,
        bride_attire_style: formData.photoType === "couple" ? formData.brideAttireStyle : formData.singleAttireStyle,
        groom_attire_style: formData.photoType === "couple" ? formData.groomAttireStyle : formData.singleAttireStyle,
      });
    },
    onSuccess: (res) => {
      if (res.data.generated_invite_image_url) {
        setGeneratedImageUrl(res.data.generated_invite_image_url);
        toast.success("Invitation generated successfully!");
      }
    },
    onError: (error: any) => {
      console.error("Failed to generate", error);

      const type = error?.type;
      if (type && ["transient", "timeout", "permanent"].includes(type)) {
        setGenerationError({ type, message: error.message });
      } else {
        setGenerationError({ type: "permanent", message: "An unexpected error occurred." });
      }

      toast.error("Failed to generate invitation.");
    }
  });

  const onSubmit = (data: AiInviteFormValues) => {
    generateMutation.mutate(data);
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
          <div className="space-y-6 md:col-span-6 lg:col-span-7">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="md:col-span-6 lg:col-span-5">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0 && data?.pages?.length === 1) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No AI Invitations found.
      </div>
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
          isGenerating={generateMutation.isPending}
          onGenerate={form.handleSubmit(onSubmit)}
          isUploadingReference={isUploadingReference}
          isUploadingCharacter={isUploadingCharacter}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-start">
          {/* Left Column: Form Controls */}
          <div className="space-y-6 md:col-span-6 lg:col-span-7">
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

              <TabsContent value="describe" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                <DesignConfigForm />
              </TabsContent>

              <TabsContent value="upload" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
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
                disabled={generateMutation.isPending || !selectedEventId}
                className="w-full h-14 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 gap-3 group rounded-xl"
              >
                {generateMutation.isPending ? (
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

          <DesignPreviewCard
            isGenerating={generateMutation.isPending}
            generatedImageUrl={generatedImageUrl}
            error={generationError}
            onRetry={() => {
              setGenerationError(null);
              form.handleSubmit(onSubmit)();
            }}
          />
        </div>
      </Form>
    </TooltipProvider>
  );
}
