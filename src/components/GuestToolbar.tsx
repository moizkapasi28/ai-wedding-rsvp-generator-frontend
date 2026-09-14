import SearchBar from "./SerachBar";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InviteSentFilter } from "@/models/guest.model";
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
    sentFilter,
    setSentFilter,
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
    // Wraps onto more lines on narrow screens instead of scrolling sideways
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-40">
        <SearchBar
          placeholder="Search by name or phone...."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="w-32">
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

        <div className="w-28">
          <MultiSelect
            options={sideOptions}
            value={sideFilter}
            onValueChange={setSideFilter}
            placeholder="Sides"
          />
        </div>

        <div className="w-28">
          <MultiSelect
            options={groupOptions}
            value={groupFilter}
            onValueChange={setGroupFilter}
            placeholder="Groups"
          />
        </div>

        <div className="w-28">
          <Select
            value={sentFilter ?? "all"}
            onValueChange={(value) =>
              setSentFilter(value === "all" ? null : (value as InviteSentFilter))
            }
          >
            <SelectTrigger className="w-full" aria-label="Invite status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All invites</SelectItem>
              <SelectItem value="sent">Invite sent</SelectItem>
              <SelectItem value="not_sent">Not sent yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
