import Page, { PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Link, PlusIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <Page>
      <PageHeader title="Dashboard">
        <Button variant="outline">
          <Link />
          <span>Share RSVP Link</span>
        </Button>
        <Button variant="default">
          <PlusIcon />
          <span>Add Guest</span>
        </Button>
      </PageHeader>
      <div className="mt-3 space-y-4 "></div>
    </Page>
  );
}
