import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/assets/Logo";
import { MenuIcon, SearchIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useHeader } from "@/contexts/HeaderContext";
import { activeWeddingAtom } from "@/store/store";
import { useAtomValue } from "jotai";

export default function Header() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { title } = useHeader();
  const activeWedding = useAtomValue(activeWeddingAtom);

  const showWeddingTitle = title !== "All Weddings" && activeWedding;

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-background border-0">
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="flex justify-between items-center py-3 px-4 border-b lg:hidden">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="toggle mobile menu"
            >
              <MenuIcon />
            </Button>
          </div>
        </div>
      )}

      {/* Main Header Area (Title) */}
      <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center gap-2">
          {!isMobile && <SidebarTrigger className="-ml-2" />}
          <h1 className="text-xl font-semibold flex items-center gap-2">
            {title}
            {showWeddingTitle && (
              <span className="text-muted-foreground text-sm font-medium">
                / {activeWedding.title}
              </span>
            )}
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex max-lg:hidden items-center">
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
