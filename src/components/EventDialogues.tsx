import { EventActionDialogue } from "./EventActionDialogue";
import { EventDeleteDialogue } from "./EventDeleteDialogue";
import { useEvent } from "./EventProvider";

export default function EventDialogues() {
  const { open, setOpen } = useEvent();

  return (
    <>
      {/* Add event dialog */}
      <EventActionDialogue
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        mode="add"
      />

      {/* Edit event dialog */}
      <EventActionDialogue
        open={open === "edit"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
        mode="edit"
      />

      {/* Delete event dialog */}
      <EventDeleteDialogue
        open={open === "delete"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
        onConfirm={() => {
          console.log("Event delete confirmed");
          setOpen(null);
        }}
      />
    </>
  );
}
