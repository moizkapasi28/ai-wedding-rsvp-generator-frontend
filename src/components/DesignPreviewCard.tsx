import type { GenerateAIInviteCardError } from "@/api/aiInviteCard.service";
import type { AiGenerationErrorCode, AiGenerationStage } from "@/models/aiInviteCard.model";
import { Button } from "@/components/ui/button";
import { Loader2, SparklesIcon, Download } from "lucide-react";


interface DesignPreviewCardProps {
  isGenerating: boolean;
  generationStage?: AiGenerationStage | null;
  generatedImageUrl: string | null;
  error?: GenerateAIInviteCardError | null;
  retrying?: { attempt: number; maxAttempts: number } | null;
  onRetry?: () => void;
}

const STAGE_MESSAGES: Record<AiGenerationStage, string> = {
  DESIGN: "Designing your invitation...",
  TYPESETTING: "Adding your wedding details...",
};

const GENERIC_FAILURE = "Something went wrong while creating your invite.";

const ERROR_MESSAGES: Record<AiGenerationErrorCode, string> = {
  SAFETY_BLOCKED:
    "The AI's safety filter blocked this design. Try a different photo or simplify the extra details.",
  BILLING: "Invite generation is unavailable right now. Please try again later.",
  INVALID_INPUT:
    "One of your uploaded images couldn't be read. Upload it again as a JPG or PNG.",
  OVERLOADED: GENERIC_FAILURE,
  RATE_LIMITED: GENERIC_FAILURE,
  TIMEOUT: GENERIC_FAILURE,
  NO_IMAGE: GENERIC_FAILURE,
  UNKNOWN: GENERIC_FAILURE,
};



export default function DesignPreviewCard({ isGenerating, generationStage, generatedImageUrl, error, retrying, onRetry }: DesignPreviewCardProps) {
  // The worker reports which stage it is on, so this reflects real progress
  const loadingMessage = retrying
    ? "The AI service is busy. Retrying automatically…"
    : generationStage
      ? STAGE_MESSAGES[generationStage]
      : "Queued — starting shortly...";

  const handleDownload = async () => {
    if (!generatedImageUrl) return;

    try {
      // The image is served from S3, where a cross-origin `download` attribute is ignored,
      // so fetch the bytes and save them from a blob URL instead.
      const response = await fetch(generatedImageUrl);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

      const blobUrl = URL.createObjectURL(await response.blob());
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "ai-wedding-invite.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download invitation", error);
      window.open(generatedImageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-col w-full h-fit">
      <div className="mb-5 space-y-1.5">
        <h3 className="text-xl font-semibold leading-none tracking-tight">Design Preview</h3>
        <p className="text-sm text-muted-foreground">
          Your generated invitation will appear here.
        </p>
      </div>

      <div className="w-full aspect-[9/16] relative group">
        <div className="overflow-hidden rounded-[24px] sm:rounded-[32px] border-[6px] border-muted/50 bg-background shadow-2xl h-full w-full relative flex items-center justify-center transition-all hover:shadow-3xl hover:border-muted duration-500 ring-1 ring-black/5 dark:ring-white/10">
          {generatedImageUrl && !isGenerating && !error ? (
            <>
              <img
                src={generatedImageUrl}
                alt="Generated Invite"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 z-20">
                <Button
                  onClick={handleDownload}
                  className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground ring-4 ring-background/50 transition-all duration-300 hover:scale-110 h-12 w-12"
                  size="icon"
                  title="Download Image"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10 p-6">
              {isGenerating ? (
                <div className="text-center space-y-5 relative z-10">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto w-fit">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-muted-foreground text-sm max-w-[200px] mx-auto animate-pulse font-medium">
                    {loadingMessage}
                  </p>
                  {retrying && (
                    <p className="text-xs text-muted-foreground">
                      Attempt {retrying.attempt} of {retrying.maxAttempts}
                    </p>
                  )}
                </div>
              ) : error ? (
                <div className="text-center space-y-4 relative z-10">
                  <div className="bg-destructive/10 p-4 rounded-full mx-auto w-fit">
                    <SparklesIcon className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-destructive font-medium text-sm max-w-[250px] mx-auto">
                    {ERROR_MESSAGES[error.code]}
                  </p>
                  {/* The couple can't fix a billing problem, so a retry would only fail again */}
                  {onRetry && error.code !== "BILLING" && (
                    <Button onClick={onRetry} className="mt-4 shadow-sm w-full rounded-xl">
                      Try again
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4 relative z-10">
                  <div className="bg-primary/10 p-5 rounded-full mx-auto w-fit shadow-inner">
                    <SparklesIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">Ready to Create</h4>
                    <p className="text-muted-foreground text-sm max-w-[220px] mx-auto">
                      Configure your preferences and click generate to see the magic.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subtle decorative glow behind the phone frame */}
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-[32px] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
}
