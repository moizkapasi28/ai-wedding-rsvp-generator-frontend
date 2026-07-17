import { GuestActionDialogue } from "./GuestActionDialogue";
import { GuestDeleteDialogue } from "./GuestDeleteDialogue";
import { useGuest } from "./GuestProvider";
import { useAtom } from "jotai";
import { activeWeddingIdAtom } from "@/store/store";
import { useGetEventsWithStatsInfinite } from "@/hooks/use-event";
import { useMemo } from "react";

export default function GuestDialogues() {
  const { open, setOpen, currentRow } = useGuest();
  const [activeWeddingId] = useAtom(activeWeddingIdAtom);

  const {
    data: eventsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetEventsWithStatsInfinite(activeWeddingId, 20);

  const dynamicEvents = useMemo(() => {
    const events =
      eventsData?.pages.flatMap((page) => page.data?.events || []) || [];
    return events.map((e) => ({
      id: e.id,
      title: e.title,
    }));
  }, [eventsData]);

  return (
    <>
      {/* Add guest dialog */}
      <GuestActionDialogue
        open={open === "add"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        mode="add"
        events={dynamicEvents}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
      {currentRow && (
        <>
          <GuestActionDialogue
            currentRow={currentRow}
            open={open === "edit"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
            mode="edit"
            events={dynamicEvents}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />

          <GuestDeleteDialogue
            currentRow={currentRow}
            open={open === "delete"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
            onConfirm={() => {
              console.log("Guest delete confirmed");
              setOpen(null);
            }}
          />
        </>
      )}
    </>
  );
}
