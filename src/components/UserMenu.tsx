import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { APP_SIDEBAR } from "@/constants";
import Avtar from "react-avatar";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useGetViewUrl } from "@/hooks/use-pageSetting";

export default function UserMenu() {
  const { isMobile } = useSidebar();
  const { mutate: handleLogout } = useLogout();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Your account";
  const userEmail = user?.email ?? "";
  
  // Stored profile pictures are S3 object keys; older ones may be full URLs
  const picture = user?.profile_picture ?? null;
  const isObjectKey =
    !!picture && !picture.startsWith("http") && !picture.startsWith("data:");
  const { data: pictureViewUrl } = useGetViewUrl(isObjectKey ? picture : null);
  const actualImageUrl = (isObjectKey ? pictureViewUrl : picture) ?? "";

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
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-sidebar dark:bg-green-400"></div>
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
                navigate("/profile");
              }
            }}>
              <item.Icon />
              <span>{item.title}</span>
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
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
