import { WeddingActionDialogue } from "./WeddingActionDialogue";
import { WeddingDeleteDialogue } from "./WeddingDeleteDialogue";
import { useWedding } from "./WeddingProvider";

export default function WeddingDialogues() {
  const { open, setOpen } = useWedding();

  return (
    <>
      {/* Add wedding dialog */}
      <WeddingActionDialogue
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        mode="add"
      />

      {/* Edit wedding dialog */}
      <WeddingActionDialogue
        open={open === "edit"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
        mode="edit"
      />

      {/* Delete wedding dialog */}
      <WeddingDeleteDialogue
        open={open === "delete"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
        onConfirm={() => {
          console.log("Delete confirmed");
          setOpen(null);
        }}
      />
    </>
  );
}
