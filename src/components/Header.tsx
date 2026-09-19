import ThemeToggle from "@/components/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useHeader } from "@/contexts/HeaderContext";
import { activeWeddingAtom } from "@/store/store";
import { useAtomValue } from "jotai";

export default function Header() {
  const { title } = useHeader();
  const activeWedding = useAtomValue(activeWeddingAtom);

  const showWeddingTitle = title !== "All Weddings" && activeWedding;

  return (
    // One bar at every width. SidebarTrigger opens the drawer on a phone and
    // collapses the rail on anything larger, so there's no separate mobile
    // top bar stealing a second row of height.
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background px-3 sm:px-4">
      <SidebarTrigger className="-ml-1 shrink-0" />

      <h1 className="flex min-w-0 items-baseline gap-2 text-base font-medium tracking-[-0.01em] sm:text-lg">
        <span className="truncate">{title}</span>
        {showWeddingTitle && (
          <span className="hidden min-w-0 truncate text-sm font-normal text-muted-foreground sm:inline">
            {activeWedding.title}
          </span>
        )}
      </h1>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}
