import SearchBar from "./SerachBar";
import { Button } from "./ui/button";

export default function WeddingToolbar() {
  return (
    <div className="flex flex-wrap gap-3 items-center w-full">
      <div className="flex-1 min-w-60">
        <SearchBar placeholder="Search by couple, city or venue" />
      </div>

      <div className="flex gap-2">
        <Button variant="outline">All</Button>
        <Button variant="outline">This Week</Button>
        <Button variant="outline">Upcoming</Button>
        <Button variant="outline">Completed</Button>
      </div>
    </div>
  );
}
