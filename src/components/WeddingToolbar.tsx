import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import SearchBar from "./SerachBar";
import { Button } from "./ui/button";
import { useWedding } from "./WeddingProvider";

const filterOptions = [
  { label: "This week", opt: "this_week" },
  { label: "Upcoming", opt: "upcoming" },
  { label: "Completed", opt: "completed" },
];

export default function WeddingToolbar() {
  const {
    search,
    setSearch,
    filter,
    setFilter,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useWedding();

  const toggle = (opt: string) =>
    setFilter(
      filter.includes(opt)
        ? filter.filter((f) => f !== opt)
        : [...filter, opt],
    );

  return (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
      <div className="lg:max-w-xs lg:flex-1">
        <SearchBar
          placeholder="Search by couple, city or venue"
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Scrolls sideways on a phone rather than wrapping into a second row
          and pushing the grid down. -mx-1/px-1 keeps focus rings visible. */}
      <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
        {filterOptions.map(({ label, opt }) => (
          <Button
            key={opt}
            size="sm"
            variant={filter.includes(opt) ? "default" : "outline"}
            className="shrink-0"
            aria-pressed={filter.includes(opt)}
            onClick={() => toggle(opt)}
          >
            {label}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() => {
            setSortBy("date");
            setSortOrder((prev) =>
              prev === "" ? "desc" : prev === "desc" ? "asc" : "",
            );
          }}
        >
          Date
          {sortOrder === "asc" && <ArrowUp />}
          {sortOrder === "desc" && <ArrowDown />}
          {sortOrder === "" && <ArrowUpDown className="text-muted-foreground" />}
        </Button>
      </div>
    </div>
  );
}
