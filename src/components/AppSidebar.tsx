import { Logo } from "@/components/Logo";
import UserMenu from "@/components/UserMenu";
import WeddingSwitcher from "@/components/WeddingSwitcher";
import { AI_CREDIT_COST, APP_SIDEBAR } from "@/constants";
import { useAiCredits } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
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
  const credits = useAiCredits();
  // Too few left for an invite card, the most expensive generation
  const lowOnCredits =
    credits !== undefined && credits < AI_CREDIT_COST.INVITE_CARD;
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
        {/* Deliberately not a SidebarMenuButton: that component forces every
            descendant svg to size-4, which squashed the logo to 16px. The
            brand row is a header, not a nav item, so it sizes itself. */}
        <NavLink
          to="/weddings"
          onClick={closeOnMobile}
          aria-label="WeddlyAI"
          className="block rounded-md px-1 py-1 transition-opacity hover:opacity-80 group-data-[collapsible=icon]:px-0"
        >
          {/* Shares the Logo component with the landing header and auth pages,
              so the mark/wordmark proportions can't drift apart again. */}
          <Logo
            className="min-w-0 group-data-[collapsible=icon]:justify-center"
            markClassName="h-9 group-data-[collapsible=icon]:h-6"
            wordmarkClassName="truncate group-data-[collapsible=icon]:hidden"
          />
        </NavLink>
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
          {credits !== undefined && (
            <SidebarMenuItem>
              {/* A readout, not a link: tells people how much AI generation
                  they have left before they run out mid-design. */}
              <SidebarMenuButton
                tooltip={`${credits} AI credits left`}
                className={cn(
                  "cursor-default hover:bg-transparent active:bg-transparent",
                  lowOnCredits && "text-destructive hover:text-destructive",
                )}
              >
                <Sparkles />
                <span className="truncate">AI credits</span>
                <span className="ml-auto font-medium tabular-nums">
                  {credits}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
