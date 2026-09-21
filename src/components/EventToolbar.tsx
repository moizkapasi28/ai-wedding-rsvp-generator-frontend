import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatSide } from "@/lib/eventSide";
import type { EventSort } from "@/models/event.model";
import { EventSide } from "@/validations/event.validation";
import { X } from "lucide-react";
import { useEvent } from "./EventProvider";
import SearchBar from "./SerachBar";

// The API wants the raw enum; only the label is humanised.
const sideOptions = Object.values(EventSide).map((s) => ({
  value: s,
  label: formatSide(s),
}));

/**
 * Search, side and ordering for the event grid. Same shape as GuestToolbar:
 * one row once there's room — search, filters, then the actions pushed right.
 * Below that the filters drop to their own line and the actions ride up beside
 * the search box, so "New event" is always on the first line. `order` does the
 * swap, so it stays one flex row rather than two layouts.
 */
export default function EventToolbar({
  actions,
}: {
  actions?: React.ReactNode;
}) {
  const { search, setSearch, sideFilter, setSideFilter, sort, setSort, hasFilters, clearFilters } =
    useEvent();

  return (
    <div className="@container/toolbar mb-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="order-1 min-w-0 flex-1 sm:max-w-xs @min-[44rem]/toolbar:min-w-44">
          <SearchBar
            placeholder="Search by name, venue or city"
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="order-2 ml-auto shrink-0 @min-[44rem]/toolbar:order-3">
          {actions}
        </div>

        {/* w-full forces its own line while the row is narrow; at width it
            joins the others. Scrolls sideways there rather than wrapping into
            ragged rows. -mx-1/px-1 keeps focus rings visible. */}
        <div className="no-scrollbar order-3 -mx-1 flex w-full items-center gap-2 overflow-x-auto px-1 pb-0.5 @min-[44rem]/toolbar:order-2 @min-[44rem]/toolbar:mx-0 @min-[44rem]/toolbar:w-auto @min-[44rem]/toolbar:overflow-visible @min-[44rem]/toolbar:px-0 @min-[44rem]/toolbar:pb-0">
          <Select
            value={sideFilter ?? "all"}
            onValueChange={(value) =>
              setSideFilter(value === "all" ? null : (value as EventSide))
            }
          >
            <SelectTrigger className="w-36 shrink-0" aria-label="Side">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sides</SelectItem>
              {sideOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as EventSort)}
          >
            <SelectTrigger className="w-40 shrink-0" aria-label="Sort events">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Recently added</SelectItem>
              <SelectItem value="date_asc">Date: earliest first</SelectItem>
              <SelectItem value="date_desc">Date: latest first</SelectItem>
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
