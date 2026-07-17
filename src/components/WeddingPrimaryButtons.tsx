import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useWedding } from "./WeddingProvider";

export default function WeddingPrimaryButtons() {
  const { setOpen } = useWedding();

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* <Button variant="outline">
        <MenuIcon />
        <span>View as list</span>
      </Button> */}
      <Button variant="default" onClick={() => setOpen("add")}>
        <PlusIcon />
        <span>New Wedding</span>
      </Button>
    </div>
  );
}
