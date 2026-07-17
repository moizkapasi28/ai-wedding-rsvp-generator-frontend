import { Logo } from "@/assets/Logo";
import { useSidebar } from "@/components/ui/sidebar";
import UserMenu from "@/components/UserMenu";
import WeddingSwitcher from "@/components/WeddingSwitcher";
import { APP_SIDEBAR } from "@/constants";
import { NavLink, useLocation } from "react-router-dom";
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
  const { isMobile, state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-0.5 max-lg:p-2">
            <Logo
              variant={isMobile ? "default" : isCollapsed ? "icon" : "default"}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <WeddingSwitcher />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_SIDEBAR.primaryNav.map((item, index) => {
                const isActive =
                  item.path === "/weddings"
                    ? location.pathname === "/weddings"
                    : location.pathname.startsWith(item.path);

                return (
                  <SidebarMenuItem key={index} title={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink 
                        to={item.path}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        {item.Icon && <item.Icon />}
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
