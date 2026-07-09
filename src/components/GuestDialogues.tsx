import { GuestActionDialogue } from "./GuestActionDialogue";
import { GuestDeleteDialogue } from "./GuestDeleteDialogue";
import { useGuest } from "./GuestProvider";

export default function GuestDialogues() {
  const { open, setOpen } = useGuest();

  return (
    <>
      {/* Add guest dialog */}
      <GuestActionDialogue
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        mode="add"
      />

      {/* Edit guest dialog */}
      <GuestActionDialogue
        open={open === "edit"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
        mode="edit"
      />

      {/* Delete guest dialog */}
      <GuestDeleteDialogue
        open={open === "delete"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
        onConfirm={() => {
          console.log("Guest delete confirmed");
          setOpen(null);
        }}
      />
    </>
  );
}
