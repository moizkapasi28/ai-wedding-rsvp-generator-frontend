import { LogoMark } from "@/components/Logo";
import UserMenu from "@/components/UserMenu";
import WeddingSwitcher from "@/components/WeddingSwitcher";
import { APP_SIDEBAR } from "@/constants";
import { useSidebar } from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export default function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();

  // /weddings is the only route that isn't a prefix of a deeper page, so it
  // matches exactly; the rest own everything beneath them.
  const isActive = (path: string) =>
    path === "/weddings"
      ? location.pathname === "/weddings"
      : location.pathname.startsWith(path);

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="WeddlyAI">
              <NavLink to="/weddings" onClick={closeOnMobile}>
                <LogoMark className="h-7 group-data-[collapsible=icon]:h-5" />
                <span className="truncate font-display text-lg font-semibold tracking-[-0.03em]">
                  WeddlyAI
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <WeddingSwitcher />

      <SidebarContent>
        {APP_SIDEBAR.nav.map((group, groupIndex) => (
          <SidebarGroup key={group.label ?? groupIndex}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      // Gives the collapsed icon rail a real label instead of
                      // relying on a native title attribute.
                      tooltip={item.title}
                    >
                      <NavLink to={item.path} onClick={closeOnMobile}>
                        <item.Icon />
                        <span className="truncate">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                    {"badge" in item && item.badge && (
                      <SidebarMenuBadge className="top-1.5! rounded-md bg-primary px-1.5 text-[0.6875rem] font-medium text-primary-foreground">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
