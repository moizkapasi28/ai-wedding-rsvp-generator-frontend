import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, SparklesIcon } from "lucide-react";
import type { GenerateAIInviteCardError } from "@/api/aiInviteCard.service";


interface DesignPreviewCardProps {
  isGenerating: boolean;
  generatedImageUrl: string | null;
  error?: GenerateAIInviteCardError | null;
  onRetry?: () => void;
}

export default function DesignPreviewCard({ isGenerating, generatedImageUrl, error, onRetry }: DesignPreviewCardProps) {
  const [loadingMessage, setLoadingMessage] = useState("Generating your invitation...");

  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;

    if (isGenerating) {
      setLoadingMessage("Generating your invitation...");

      timer1 = setTimeout(() => {
        setLoadingMessage("Still working on it...");
      }, 3000);

      timer2 = setTimeout(() => {
        setLoadingMessage("Taking a little longer than usual — hang tight...");
      }, 8000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isGenerating]);

  return (
    <Card className="border-border shadow-sm flex flex-col h-full md:col-span-6 lg:col-span-5 md:sticky md:top-6 min-h-[400px] md:min-h-[500px]">
      <CardHeader>
        <CardTitle>Design Preview</CardTitle>
        <CardDescription>
          Your generated invitation will appear here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-6 bg-muted/30 m-6 mt-0 rounded-lg border-2 border-dashed relative overflow-hidden">
        {isGenerating ? (
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm max-w-[200px] mx-auto animate-pulse">
              {loadingMessage}
            </p>
          </div>
        ) : error ? (
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 p-4 rounded-full mx-auto w-fit">
              <SparklesIcon className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-medium text-sm max-w-[250px] mx-auto">
              {error.type === "transient" || error.type === "timeout"
                ? "Something went wrong generating your invitation. This usually resolves quickly."
                : "We couldn't generate your invitation. Please check your details and try again, or contact support."}
            </p>
            {onRetry && (
              <Button onClick={onRetry} variant={error.type === "permanent" ? "outline" : "default"} className="mt-4">
                Try Again
              </Button>
            )}
          </div>
        ) : generatedImageUrl ? (
          <img
            src={generatedImageUrl}
            alt="Generated Invite"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full mx-auto w-fit">
              <SparklesIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
              Configure your preferences on the left and click generate to see the magic.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
