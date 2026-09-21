import SearchBar from "./SerachBar";
import { Button } from "@/components/ui/button";
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
import { useAtomValue } from "jotai";
import { X } from "lucide-react";
import { formatSide } from "@/lib/eventSide";
import { useGuest } from "./GuestProvider";

const sentence = (value: string) =>
  value === "VIP" ? "VIP" : value.charAt(0) + value.slice(1).toLowerCase();

/**
 * One row once there's room for it: search, filters, then the actions pushed
 * right. Below that the filters drop to their own line (w-full) and the actions
 * ride up beside the search box, so the daily button is always on the first
 * line. `order` does the swap, so it's one flex row rather than two layouts.
 */
export default function GuestToolbar({
  actions,
}: {
  actions?: React.ReactNode;
}) {
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
    hasFilters,
    clearFilters,
  } = useGuest();
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetEventsWithStatsInfinite(activeWeddingId, 20, false);
  const events = data?.pages.flatMap((page) => page.data?.events || []) || [];

  const eventOptions = events.map((e) => ({ value: e.id, label: e.title }));
  // The API wants the raw enum; only the label is humanised.
  const sideOptions = Object.values(Side).map((s) => ({
    value: s,
    label: formatSide(s),
  }));
  const groupOptions = Object.values(GuestGroup).map((g) => ({
    value: g,
    label: sentence(g),
  }));

  return (
    <div className="@container/toolbar mb-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="order-1 min-w-0 flex-1 sm:max-w-xs @min-[59rem]/toolbar:min-w-44">
          <SearchBar
            placeholder="Search by name or phone"
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="order-2 ml-auto shrink-0 @min-[59rem]/toolbar:order-3">
          {actions}
        </div>

        {/* w-full forces its own line while the row is narrow; at width it
            joins the others. Scrolls sideways there rather than wrapping into
            ragged rows. -mx-1/px-1 keeps focus rings visible. */}
        <div className="no-scrollbar order-3 -mx-1 flex w-full items-center gap-2 overflow-x-auto px-1 pb-0.5 @min-[59rem]/toolbar:order-2 @min-[59rem]/toolbar:mx-0 @min-[59rem]/toolbar:w-auto @min-[59rem]/toolbar:overflow-visible @min-[59rem]/toolbar:px-0 @min-[59rem]/toolbar:pb-0">
        <MultiSelect
          className="w-32 shrink-0"
          options={eventOptions}
          value={eventFilter}
          onValueChange={setEventFilter}
          placeholder="Events"
          isFetchingNextPage={isFetchingNextPage}
          onScrollEnd={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
        />

        <MultiSelect
          className="w-28 shrink-0"
          options={sideOptions}
          value={sideFilter}
          onValueChange={setSideFilter}
          placeholder="Side"
        />

        <MultiSelect
          className="w-28 shrink-0"
          options={groupOptions}
          value={groupFilter}
          onValueChange={setGroupFilter}
          placeholder="Group"
        />

        <Select
          value={sentFilter ?? "all"}
          onValueChange={(value) =>
            setSentFilter(value === "all" ? null : (value as InviteSentFilter))
          }
        >
          <SelectTrigger className="w-32 shrink-0" aria-label="Invite status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All invites</SelectItem>
            <SelectItem value="sent">Invite sent</SelectItem>
            <SelectItem value="not_sent">Not sent yet</SelectItem>
          </SelectContent>
        </Select>

        {/* Only offered once there's something to clear */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={clearFilters}
          >
            <X />
            Clear
          </Button>
        )}
        </div>
      </div>
    </div>
  );
}
