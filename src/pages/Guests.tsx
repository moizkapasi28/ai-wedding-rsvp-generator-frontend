import Page, { PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";

export default function Guests() {
  return (
    <Page>
      <PageHeader title="Guests">
        <Button variant="outline">
          <DownloadIcon />
          <span>Export CSV</span>
        </Button>

        <Button variant="default">
          <PlusIcon />
          <span>Add Guest</span>
        </Button>
      </PageHeader>
    </Page>
  );
}
