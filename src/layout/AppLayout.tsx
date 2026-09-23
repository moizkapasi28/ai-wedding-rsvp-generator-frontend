import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { useGetWeddingsInfinite } from "@/hooks/use-wedding";
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
  const { data, isLoading, hasNextPage } = useGetWeddingsInfinite(20);
  const weddings = useMemo(
    () => data?.pages.flatMap((page) => page.data?.weddings || []) || [],
    [data],
  );
  const [activeWeddingId, setActiveWeddingId] = useAtom(activeWeddingIdAtom);
  const [activeWedding, setActiveWedding] = useAtom(activeWeddingAtom);

  // The id is the selection; the stored wedding is a copy of it that the
  // header, the dashboard countdown and the switcher read. Both are written
  // here, so a fresh login that auto-picks the first wedding fills in the copy
  // too — it used to be written only when someone clicked the switcher, which
  // left the dashboard showing "No date set yet" until they did.
  useEffect(() => {
    if (weddings.length === 0) return;

    const active = weddings.find((w) => w.id === activeWeddingId);

    // Only the first page of weddings is loaded here, so one picked through
    // the switcher's own search can be missing from this list without having
    // been deleted. Falling back to the first wedding bounced that choice
    // straight back; while there are pages we haven't seen, a selection we
    // can't find is left alone.
    if (activeWeddingId && !active && hasNextPage) return;

    const next = active ?? weddings[0];

    if (next.id !== activeWeddingId) setActiveWeddingId(next.id);
    // updated_at so an edited wedding refreshes the copy rather than keeping
    // the title and date it had when it was picked
    if (
      activeWedding?.id !== next.id ||
      activeWedding.updated_at !== next.updated_at
    ) {
      setActiveWedding(next);
    }
  }, [
    weddings,
    hasNextPage,
    activeWeddingId,
    activeWedding,
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
