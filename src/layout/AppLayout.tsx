import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { useGetWeddingsInfinite } from "@/hooks/use-wedding";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import Loader from "@/components/ui/loader";

// Tablets (768-1023px) start as an icon rail so the content keeps its width;
// desktops start expanded. Once the user toggles it, SidebarProvider's own
// cookie wins, so their choice sticks across reloads.
const initialSidebarOpen = () => {
  const saved = document.cookie.match(/(?:^|;\s*)sidebar_state=([^;]+)/);
  if (saved) return saved[1] === "true";
  return window.innerWidth >= 1024;
};

export default function AppLayout() {
  const { data, isLoading } = useGetWeddingsInfinite(20);
  const weddings = useMemo(
    () => data?.pages.flatMap((page) => page.data?.weddings || []) || [],
    [data],
  );
  const [activeWeddingId, setActiveWeddingId] = useAtom(activeWeddingIdAtom);

  useEffect(() => {
    if (weddings.length > 0 && !activeWeddingId) {
      setActiveWeddingId(weddings[0].id);
    } else if (weddings.length > 0 && activeWeddingId) {
      const exists = weddings.some((w) => w.id === activeWeddingId);
      if (!exists) {
        setActiveWeddingId(weddings[0].id);
      }
    }
  }, [weddings, activeWeddingId, setActiveWeddingId]);

  if (isLoading || (weddings.length > 0 && !activeWeddingId)) {
    return <Loader />;
  }

  return (
    <SidebarProvider defaultOpen={initialSidebarOpen()}>
      <HeaderProvider>
        <AppSidebar />
        {/* min-w-0 stops wide content (e.g. the guest table) from stretching the page; it scrolls in its own container instead */}
        <SidebarInset className="min-w-0">
          <Header />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </HeaderProvider>
    </SidebarProvider>
  );
}
