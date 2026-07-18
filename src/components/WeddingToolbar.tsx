import SearchBar from "./SerachBar";
import { Button } from "./ui/button";
import { useWedding } from "./WeddingProvider";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function WeddingToolbar() {
  const {
    search,
    setSearch,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useWedding();

  const filterOptions = [
    {
      label: "This Week",
      opt: "this_week",
    },
    {
      label: "Upcoming",
      opt: "upcoming",
    },
    {
      label: "Completed",
      opt: "completed",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center w-full">
      <div className="flex-1 min-w-60">
        <SearchBar
          placeholder="Search by couple, city or venue"
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="flex gap-2">
        {filterOptions.map(({ label, opt }) => (
          <Button
            key={opt}
            variant={filter.includes(opt) ? "default" : "outline"}
            onClick={() => {
              if (filter.includes(opt)) {
                setFilter(filter.filter((f) => f !== opt));
              } else {
                setFilter([...filter, opt]);
              }
            }}
          >
            {label}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setSortBy("date");
            setSortOrder((prev) =>
              prev === "" ? "desc" : prev === "desc" ? "asc" : "",
            );
          }}
          className="gap-2"
        >
          Wedding Date
          {sortOrder === "asc" && <ArrowUp className="w-4 h-4" />}
          {sortOrder === "desc" && <ArrowDown className="w-4 h-4" />}
          {sortOrder === "" && (
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
