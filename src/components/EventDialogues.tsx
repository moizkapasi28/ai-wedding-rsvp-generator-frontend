import { EventActionDialogue } from "./EventActionDialogue";
import { EventDeleteDialogue } from "./EventDeleteDialogue";
import { useEvent } from "./EventProvider";

export default function EventDialogues() {
  const { open, setOpen, currentRow } = useEvent();

  return (
    <>
      <EventActionDialogue
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        mode="add"
      />

      {currentRow && (
        <>
          <EventActionDialogue
            currentRow={currentRow}
            open={open === "edit"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
            mode="edit"
          />

          <EventDeleteDialogue
            currentRow={currentRow}
            open={open === "delete"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
            onConfirm={() => {
              console.log("Event delete confirmed");
              setOpen(null);
            }}
          />
        </>
      )}
    </>
  );
}
