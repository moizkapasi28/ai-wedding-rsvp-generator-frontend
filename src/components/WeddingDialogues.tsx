import { WeddingActionDialogue } from "./WeddingActionDialogue";
import { WeddingDeleteDialogue } from "./WeddingDeleteDialogue";
import { useWedding } from "./WeddingProvider";

export default function WeddingDialogues() {
  const { open, setOpen, currentRow } = useWedding();

  return (
    <>
      <WeddingActionDialogue
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        mode="add"
      />

      {currentRow && (
        <>
          <WeddingActionDialogue
            currentRow={currentRow}
            open={open === "edit"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
            mode="edit"
          />

          <WeddingDeleteDialogue
            currentRow={currentRow}
            open={open === "delete"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
          />
        </>
      )}
    </>
  );
}
