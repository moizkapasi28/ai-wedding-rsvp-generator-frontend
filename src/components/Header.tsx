import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/assets/Logo";
import { MenuIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="flex justify-between gap-1 items-center py-3 ps-4 pe-2 border-b lg:hidden">
      <Logo />
      <div className="ml-auto">
        <ThemeToggle />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className=""
        aria-label="toggle mobile menu"
      >
        <MenuIcon />
      </Button>
    </header>
  );
}
