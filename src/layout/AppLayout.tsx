import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { useGetWeddings } from "@/hooks/use-wedding";
import { activeWeddingIdAtom } from "@/store/store";
import { useAtom } from "jotai";
import { useEffect } from "react";
import Loader from "@/components/ui/loader";

export default function AppLayout() {
  const { data, isLoading } = useGetWeddings(1, 100);
  const weddings = data?.data?.weddings || [];
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
  );
}
