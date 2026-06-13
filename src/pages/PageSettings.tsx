import Page, { PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Settings2Icon } from "lucide-react";

export default function PageSettings() {
  return (
    <Page>
      <PageHeader title="Page Settings">
        <Button variant="outline">
          <Settings2Icon />
          <span>Customize</span>
        </Button>
        <Button variant="outline">
          <DownloadIcon />
          <span>Export</span>
        </Button>
      </PageHeader>
      <div>Page Settings Content</div>
    </Page>
  );
}
