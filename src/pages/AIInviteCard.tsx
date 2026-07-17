import Page, { PageHeader } from "@/components/Page";

import { Sparkles } from "lucide-react";

export default function AIInviteCard() {
  return (
    <Page>
      <PageHeader title="AI Invite Card" />
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed rounded-xl p-8 bg-muted/10 mt-6">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're brewing up some magic! Soon, you'll be able to generate beautiful AI-powered invite cards for your guests.
        </p>
      </div>
    </Page>
  );
}
