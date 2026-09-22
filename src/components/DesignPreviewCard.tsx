import type { GenerateInviteCardError } from "@/api/inviteCard.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AiGenerationErrorCode,
  AiGenerationStage,
} from "@/models/inviteCard.model";
import { Download, Loader2, SparklesIcon } from "lucide-react";

interface DesignPreviewCardProps {
  isGenerating: boolean;
  generationStage?: AiGenerationStage | null;
  generatedImageUrl: string | null;
  error?: GenerateInviteCardError | null;
  retrying?: { attempt: number; maxAttempts: number } | null;
  onRetry?: () => void;
  // An own-card upload in flight; the upload control lives in its own tab
  isUploading?: boolean;
}

const STAGE_MESSAGES: Record<AiGenerationStage, string> = {
  DESIGN: "Designing your invitation…",
  TYPESETTING: "Adding your wedding details…",
};

const GENERIC_FAILURE = "Something went wrong while creating your invite.";

const ERROR_MESSAGES: Record<AiGenerationErrorCode, string> = {
  SAFETY_BLOCKED:
    "The AI's safety filter blocked this design. Try a different photo or simplify the extra details.",
  BILLING:
    "Invite generation is unavailable right now. Please try again later.",
  INVALID_INPUT:
    "One of your uploaded images couldn't be read. Upload it again as a JPG or PNG.",
  OVERLOADED: GENERIC_FAILURE,
  RATE_LIMITED: GENERIC_FAILURE,
  TIMEOUT: GENERIC_FAILURE,
  NO_IMAGE: GENERIC_FAILURE,
  UNKNOWN: GENERIC_FAILURE,
};

export default function DesignPreviewCard({
  isGenerating,
  generationStage,
  generatedImageUrl,
  error,
  retrying,
  onRetry,
  isUploading = false,
}: DesignPreviewCardProps) {
  // The worker reports which stage it is on, so this reflects real progress
  const loadingMessage = retrying
    ? "The AI service is busy. Retrying automatically…"
    : generationStage
      ? STAGE_MESSAGES[generationStage]
      : "Queued — starting shortly…";

  const handleDownload = async () => {
    if (!generatedImageUrl) return;

    try {
      // The image is served from S3, where a cross-origin `download` attribute is ignored,
      // so fetch the bytes and save them from a blob URL instead.
      const response = await fetch(generatedImageUrl);
      if (!response.ok)
        throw new Error(`Download failed with status ${response.status}`);

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

  const showImage = generatedImageUrl && !isGenerating && !error;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          The card you'd send to guests. Generating a new one replaces it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* The card's own proportions, so an empty frame is the same shape as
            a finished invitation rather than a box that resizes on arrival.
            Square corners: a printed invitation has them, and rounding the
            frame clipped the corners of the artwork inside it. */}
        <div className="relative aspect-[9/16] w-full overflow-hidden border border-border bg-muted/30">
          {showImage ? (
            <>
              <img
                src={generatedImageUrl}
                alt="Invitation"
                className="absolute inset-0 size-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50">
                  <Loader2 className="size-5 animate-spin text-white" />
                  <span className="text-xs font-medium text-white">
                    Uploading…
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex size-full flex-col items-center justify-center px-6 text-center">
              {isGenerating ? (
                <>
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  <p className="mt-4 max-w-[26ch] text-sm text-muted-foreground">
                    {loadingMessage}
                  </p>
                  {retrying && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Attempt {retrying.attempt} of {retrying.maxAttempts}
                    </p>
                  )}
                </>
              ) : error ? (
                <>
                  <p className="max-w-[32ch] text-sm leading-relaxed text-destructive">
                    {ERROR_MESSAGES[error.code]}
                  </p>
                  {/* The couple can't fix a billing problem, so a retry would
                      only fail again */}
                  {onRetry && error.code !== "BILLING" && (
                    <Button
                      variant="outline"
                      className="mt-5"
                      onClick={onRetry}
                    >
                      Try again
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <SparklesIcon className="size-5 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium">Nothing generated yet</p>
                  <p className="mt-1 max-w-[30ch] text-sm text-muted-foreground">
                    Set up the design and generate one, or upload a card you
                    already have under Use my own card.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Below the image rather than floating on top of it: a card is worth
            looking at, and a button parked over one corner covers it. */}
        {showImage && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownload}
            disabled={isUploading}
          >
            <Download />
            Download
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
