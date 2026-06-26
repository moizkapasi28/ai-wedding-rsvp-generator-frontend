import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { APP_SIDEBAR } from "@/constants";
import Avtar from "react-avatar";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";

export default function UserMenu() {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="relative">
            <Avtar
              name={APP_SIDEBAR.curProfile.name}
              size="32px"
              round={true}
              src={APP_SIDEBAR.curProfile.src}
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 dark:bg-green-400 ring-sidebar ring-1"></div>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{APP_SIDEBAR.curProfile.name}</span>
            <span className="truncate text-xs text-muted-foreground">{APP_SIDEBAR.curProfile.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avtar
              name={APP_SIDEBAR.curProfile.name}
              size="32px"
              round={true}
              src={APP_SIDEBAR.curProfile.src}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{APP_SIDEBAR.curProfile.name}</span>
              <span className="truncate text-xs text-muted-foreground">{APP_SIDEBAR.curProfile.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {APP_SIDEBAR.userMenu.itemsPrimary.map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.Icon />
              <span>{item.title}</span>
              {item.kbd && (
                <DropdownMenuShortcut>{item.kbd}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {APP_SIDEBAR.userMenu.itemsSecondary.map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.Icon />
              <span>{item.title}</span>
              {item.kbd && (
                <DropdownMenuShortcut>{item.kbd}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
