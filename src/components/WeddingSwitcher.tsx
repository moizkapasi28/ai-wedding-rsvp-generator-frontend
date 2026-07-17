import { useSidebar } from "@/components/ui/sidebar";
import { useGetWeddingsInfinite } from "@/hooks/use-wedding";
import { cn } from "@/lib/utils";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtom } from "jotai";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Heart,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import * as React from "react";

const GRADIENTS = [
  "from-pink-500 via-rose-500 to-red-500",
  "from-purple-500 to-indigo-500",
  "from-teal-400 to-emerald-600",
  "from-amber-400 to-orange-600",
  "from-blue-400 to-cyan-600",
];

const getWeddingColor = (id: string) => {
  if (!id) return GRADIENTS[0];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

const getInitials = (bride: string, groom: string) => {
  return (
    `${bride?.charAt(0) || ""}${groom?.charAt(0) || ""}`.toUpperCase() || "W"
  );
};

export default function WeddingSwitcher() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";


  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWeddingsInfinite(20);
  
  const weddings = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.weddings || []) || [];
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const [activeWeddingId, setActiveWeddingId] = useAtom(activeWeddingIdAtom);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const activeWedding = React.useMemo(() => {
    return weddings.find((w) => w.id === activeWeddingId) || weddings[0];
  }, [weddings, activeWeddingId]);

  const filteredWeddings = React.useMemo(() => {
    return weddings.filter(
      (w) =>
        w.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.venue?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [weddings, searchQuery]);

  const handleSelectWedding = (id: string) => {
    setActiveWeddingId(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activeWedding && weddings.length === 0) {
    return (
      <div className="relative w-full px-1 py-1.5">
        <div className="flex items-center gap-2 rounded-lg text-left p-2 border border-sidebar-border/30 bg-sidebar/50 shadow-xs w-full justify-center text-xs text-muted-foreground">
          No weddings found
        </div>
      </div>
    );
  }

  if (!activeWedding) return null;

  return (
    <div className="relative w-full px-1 py-1.5" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg text-left outline-hidden transition-all duration-200 cursor-pointer w-full focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          isCollapsed
            ? "justify-center p-1.5 hover:bg-sidebar-accent"
            : "p-2 hover:bg-sidebar-accent border border-sidebar-border/30 bg-sidebar/50 shadow-xs",
        )}
        aria-label="Select wedding"
      >
        {/* Avatar/Badge */}
        <div
          className={cn(
            "flex items-center justify-center shrink-0 rounded-md font-bold text-white shadow-sm transition-transform duration-200 bg-linear-to-br",
            getWeddingColor(activeWedding.id),
            isCollapsed ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm",
          )}
        >
          {getInitials(activeWedding.bride_name, activeWedding.groom_name)}
        </div>

        {/* Text Details (Hidden when collapsed) */}
        {!isCollapsed && (
          <div className="flex flex-col flex-1 min-w-0 pr-1 select-none">
            <span className="text-xs font-semibold truncate leading-tight text-sidebar-foreground">
              {activeWedding.title}
            </span>
            <span className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1 font-medium">
              <Calendar className="h-2.5 w-2.5 shrink-0" />
              {activeWedding.date
                ? new Date(activeWedding.date).toLocaleDateString()
                : "No Date"}
            </span>
          </div>
        )}

        {/* Chevron Icon (Hidden when collapsed) */}
        {!isCollapsed && (
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-60 group-hover:opacity-100" />
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 rounded-xl border border-sidebar-border bg-popover/95 backdrop-blur-md text-popover-foreground shadow-lg flex flex-col p-1.5 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150",
            isCollapsed
              ? "left-12 top-1.5 w-72 origin-top-left"
              : "left-1 right-1 top-full mt-1.5 origin-top",
          )}
        >
          {/* Search input */}
          <div className="relative flex items-center px-1 border-b border-border/40 pb-1.5 mb-1.5 pt-0.5">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground opacity-60" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search weddings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 text-xs text-foreground placeholder-muted-foreground/80 pl-8 pr-3 py-1.5 rounded-md border border-transparent hover:bg-muted/70 focus:bg-background focus:border-border outline-hidden transition-all"
            />
          </div>

          {/* List Header */}
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-muted-foreground tracking-wider select-none">
            Select Wedding
          </div>

          {/* Scrollable list */}
          <div 
            className="flex flex-col max-h-56 overflow-y-auto no-scrollbar gap-0.5 pr-0.5"
            onScroll={handleScroll}
          >
            {filteredWeddings.length > 0 ? (
              filteredWeddings.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleSelectWedding(w.id)}
                  className={cn(
                    "flex items-center gap-2.5 w-full text-left p-1.5 rounded-lg cursor-pointer hover:bg-accent group/item transition-colors",
                    w.id === activeWeddingId && "bg-accent/40",
                  )}
                >
                  {/* Badge */}
                  <div
                    className={cn(
                      "flex items-center justify-center h-7 w-7 rounded-md font-bold text-[11px] text-white shadow-xs shrink-0 bg-linear-to-br",
                      getWeddingColor(w.id),
                    )}
                  >
                    {getInitials(w.bride_name, w.groom_name)}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-semibold text-sidebar-foreground truncate flex items-center gap-1">
                      {w.title}
                      {w.id === activeWeddingId && (
                        <Heart className="h-2.5 w-2.5 text-pink-500 fill-pink-500 shrink-0 inline" />
                      )}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate font-medium">
                      {w.date ? new Date(w.date).toLocaleDateString() : ""}{" "}
                      {w.city ? `• ${w.city}` : ""}
                    </span>
                  </div>

                  {/* Check icon */}
                  {w.id === activeWeddingId && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-auto" />
                  )}
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground select-none">
                No wedding projects found
              </div>
            )}
            
            {isFetchingNextPage && (
              <div className="py-2 text-center flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="h-px bg-border/40 my-1.5 -mx-1.5" />

          {/* Action Button */}
          <button
            className="flex items-center gap-2 w-full text-left p-2 rounded-lg cursor-not-allowed opacity-60 text-xs font-medium text-foreground transition-colors"
            disabled
          >
            <div className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-muted-foreground shrink-0">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <span>Add Wedding</span>
          </button>
        </div>
      )}
    </div>
  );
}
