import { Logo } from "@/assets/Logo";
import { useSidebar } from "@/components/ui/sidebar";
import UserMenu from "@/components/UserMenu";
import { APP_SIDEBAR } from "@/constants";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import Avtar from "react-avatar";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export default function AppSidebar() {
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-0.5 max-lg:p-2">
            <Logo variant={isMobile ? "default" : "icon"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_SIDEBAR.primaryNav.map((item, index) => (
                <SidebarMenuItem key={index} title={item.title}>
                  <SidebarMenuButton>
                    {item.Icon && <item.Icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isMobile && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {APP_SIDEBAR.secondaryNav.map((item, index) => (
                  <SidebarMenuItem key={index} title={item.title}>
                    <SidebarMenuButton>
                      {item.Icon && <item.Icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className={cn(isMobile && "border-t")}>
        <SidebarMenu>
          <SidebarMenuItem className={cn(isMobile && "p-2")}>
            {isMobile ? (
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-2">
                  <div className="relative">
                    <Avtar
                      name="John Doe"
                      size="36px"
                      round={true}
                      src={APP_SIDEBAR.curProfile.src}
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 dark:bg-green-400 ring-sidebar ring-1"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {APP_SIDEBAR.curProfile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {APP_SIDEBAR.curProfile.email}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <UserMenu />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
