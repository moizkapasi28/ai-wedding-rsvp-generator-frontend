import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  return (
    <ErrorState
      code="503"
      home={false}
      title="We're down for maintenance"
      body="WeddlyAI is being updated and will be back shortly. Your weddings, guests and RSVPs are safe — nothing has been lost."
      action={
        <Button onClick={() => window.location.reload()}>Try again</Button>
      }
    />
  );
}
