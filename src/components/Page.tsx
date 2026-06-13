import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function Page({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-6 md:p-3">{children}</div>;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  const { isMobile } = useSidebar();

  return (
    <div className="sticky top-0 z-30 bg-background ">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between py-2">
        <div className="flex items-center gap-2">
          {!isMobile && <SidebarTrigger className="-ml-1" />}
          <h1 className="text-xl">{title}</h1>
        </div>

        <div className="flex gap-3">
          <div className="flex max-lg:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
          </div>

          <div className="flex items-center gap-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
