import Notice from "@/components/Notice";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Empty state for pages that can't work until the wedding has at least one event
export default function NoEventsState({ description }: { description: string }) {
  return (
    <Notice
      title="No events yet."
      body={description}
      action={
        <Button asChild>
          <Link to="/events">Go to events</Link>
        </Button>
      }
    />
  );
}
