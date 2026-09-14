import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Empty state for pages that can't work until the wedding has at least one event
export default function NoEventsState({ description }: { description: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-xl font-bold">No events yet</h2>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <Button asChild>
        <Link to="/events">Go to events</Link>
      </Button>
    </div>
  );
}
