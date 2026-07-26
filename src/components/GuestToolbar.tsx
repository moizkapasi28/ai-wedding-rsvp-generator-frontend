import SearchBar from "./SerachBar";
import { MultiSelect } from "@/components/ui/multi-select";
import { Side, GuestGroup } from "@/validations/guest.validation";
import { useGetEventsWithStatsInfinite } from "@/hooks/use-event";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtom } from "jotai";
import { useGuest } from "./GuestProvider";

export default function GuestToolbar() {
  const {
    search,
    setSearch,
    eventFilter,
    setEventFilter,
    sideFilter,
    setSideFilter,
    groupFilter,
    setGroupFilter,
  } = useGuest();
  const [activeWeddingid] = useAtom(activeWeddingIdAtom);
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetEventsWithStatsInfinite(activeWeddingid, 20, false);
  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];

  const eventOptions = events.map((e) => ({ value: e.id, label: e.title }));
  const sideOptions = Object.values(Side).map((s) => ({ value: s, label: s }));
  const groupOptions = Object.values(GuestGroup).map((g) => ({
    value: g,
    label: g,
  }));

  return (
    <div className="flex gap-3 items-center w-full flex-nowrap">
      <div className="flex-1 min-w-45">
        <SearchBar
          placeholder="Search by name or phone...."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="flex gap-2 shrink-0">
        <div className="w-45">
          <MultiSelect
            options={eventOptions}
            value={eventFilter}
            onValueChange={setEventFilter}
            placeholder="Events"
            isFetchingNextPage={isFetchingNextPage}
            onScrollEnd={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
          />
        </div>

        <div className="w-37.5">
          <MultiSelect
            options={sideOptions}
            value={sideFilter}
            onValueChange={setSideFilter}
            placeholder="Sides"
          />
        </div>

        <div className="w-37.5">
          <MultiSelect
            options={groupOptions}
            value={groupFilter}
            onValueChange={setGroupFilter}
            placeholder="Groups"
          />
        </div>
      </div>
    </div>
  );
}
