import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useWedding } from "./WeddingProvider";

export default function WeddingPrimaryButtons() {
  const { setOpen } = useWedding();

  return (
    // Full width on a phone, shrink-wrapped once it shares a row with the
    // filters. order- puts it back on the right at desktop widths.
    <div className="order-first flex shrink-0 lg:order-last">
      <Button className="w-full lg:w-auto" onClick={() => setOpen("add")}>
        <PlusIcon />
        New wedding
      </Button>
    </div>
  );
}
