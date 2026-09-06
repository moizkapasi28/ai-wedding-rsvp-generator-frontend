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
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generalService } from "@/api/general.service";

export default function UserMenu() {
  const { isMobile } = useSidebar();
  const { mutate: handleLogout } = useLogout();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user ? `${user.first_name} ${user.last_name}` : APP_SIDEBAR.curProfile.name;
  const userEmail = user?.email || APP_SIDEBAR.curProfile.email;
  
  const [actualImageUrl, setActualImageUrl] = useState<string>("");

  useEffect(() => {
    if (user?.profile_picture) {
      if (user.profile_picture.startsWith('http') || user.profile_picture.startsWith('data:')) {
        setActualImageUrl(user.profile_picture);
      } else {
        generalService.generateViewUrl(user.profile_picture)
          .then(res => setActualImageUrl(res.data.url))
          .catch(() => setActualImageUrl(""));
      }
    } else {
      setActualImageUrl("");
    }
  }, [user?.profile_picture]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="relative">
            <Avtar
              name={userName}
              size="32px"
              round={true}
              src={actualImageUrl}
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 dark:bg-green-400 ring-sidebar ring-1"></div>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
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
              name={userName}
              size="32px"
              round={true}
              src={actualImageUrl}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userName}</span>
              <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {APP_SIDEBAR.userMenu.itemsPrimary.map((item, index) => (
            <DropdownMenuItem key={index} onClick={() => {
              if (item.title === "View profile") {
                navigate("/weddings/profile");
              }
            }}>
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
            <DropdownMenuItem key={index} onClick={() => {
              if (item.title === "Sign out") {
                handleLogout();
              }
            }}>
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
