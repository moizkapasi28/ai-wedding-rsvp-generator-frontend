import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { useGetWedding, useGetWeddingsInfinite } from "@/hooks/use-wedding";
import { activeWeddingAtom, activeWeddingIdAtom } from "@/store/store";
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
  const [activeWedding, setActiveWedding] = useAtom(activeWeddingAtom);

  // The selected wedding is fetched by id rather than looked up in the list
  // above, which only holds the first page: a wedding picked through the
  // switcher's search can sit beyond it, and this also keeps the stored copy
  // current after a rename.
  const { data: selected, error: selectedError } =
    useGetWedding(activeWeddingId);
  // Only a 404 means it's really gone; a network blip must not throw the user
  // onto a different wedding.
  const selectionGone =
    (selectedError as { status?: number } | null)?.status === 404;

  // The id is the selection; the stored wedding is a copy of it that the
  // header, the dashboard countdown and the switcher read. Both are written
  // here, so a fresh login that auto-picks the first wedding fills in the copy
  // too — it used to be written only when someone clicked the switcher, which
  // left the dashboard showing "No date set yet" until they did.
  useEffect(() => {
    if (!activeWeddingId || selectionGone) {
      if (weddings.length > 0) {
        setActiveWeddingId(weddings[0].id);
        setActiveWedding(weddings[0]);
      }
      return;
    }

    const current = selected?.data;
    if (!current) return;

    // updated_at so an edited wedding refreshes the copy rather than keeping
    // the title and date it had when it was picked
    if (
      activeWedding?.id !== current.id ||
      activeWedding.updated_at !== current.updated_at
    ) {
      setActiveWedding(current);
    }
  }, [
    weddings,
    activeWeddingId,
    activeWedding,
    selected,
    selectionGone,
    setActiveWeddingId,
    setActiveWedding,
  ]);

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
