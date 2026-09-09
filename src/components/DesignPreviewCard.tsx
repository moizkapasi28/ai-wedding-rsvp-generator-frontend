import type { GenerateAIInviteCardError } from "@/api/aiInviteCard.service";
import { Button } from "@/components/ui/button";
import { Loader2, SparklesIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";


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
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = generatedImageUrl;
                    a.download = "ai-wedding-invite.png";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
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
                </div>
              ) : error ? (
                <div className="text-center space-y-4 relative z-10">
                  <div className="bg-destructive/10 p-4 rounded-full mx-auto w-fit">
                    <SparklesIcon className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-destructive font-medium text-sm max-w-[250px] mx-auto">
                    {error.type === "transient" || error.type === "timeout"
                      ? "Something went wrong. This usually resolves quickly."
                      : "We couldn't generate your invitation. Please try again."}
                  </p>
                  {onRetry && (
                    <Button onClick={onRetry} variant={error.type === "permanent" ? "outline" : "default"} className="mt-4 shadow-sm w-full rounded-xl">
                      Try Again
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
