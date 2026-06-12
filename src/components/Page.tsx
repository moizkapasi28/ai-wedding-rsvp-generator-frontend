import { SearchIcon, Settings2Icon, DownloadIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Page({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-6 md:p-4">{children}</div>;
}

export function PageHeader() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
      <h1 className="text-xl">Welcome back, Moiz</h1>
      <div className="flex gap-3">
        <div className="flex max-lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Search">
            <SearchIcon />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings2Icon />
            <span>Customize</span>
          </Button>
          <Button variant="outline">
            <DownloadIcon />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
