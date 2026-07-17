import Page, { PageHeader } from "@/components/Page";

import { Eye } from "lucide-react";

export default function GuestPreview() {
  return (
    <Page>
      <PageHeader title="Guest Preview" />
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed rounded-xl p-8 bg-muted/10 mt-6">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We are currently working on this feature! Soon you will be able to preview exactly what your guests will see when they RSVP.
        </p>
      </div>
    </Page>
  );
}
