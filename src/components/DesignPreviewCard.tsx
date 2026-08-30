import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, SparklesIcon } from "lucide-react";

interface DesignPreviewCardProps {
  isGenerating: boolean;
  generatedImageUrl: string | null;
}

export default function DesignPreviewCard({ isGenerating, generatedImageUrl }: DesignPreviewCardProps) {
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
              Applying fine art aesthetics and crafting your luxury invite...
            </p>
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
