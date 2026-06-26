import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "@/contexts/HeaderContext";

export default function AppLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <HeaderProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main>
              <Outlet />
            </main>
          </SidebarInset>
        </HeaderProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
