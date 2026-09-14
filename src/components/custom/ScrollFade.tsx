import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";

type ScrollFadeProps = {
  className?: string;
  children: ReactNode;
};

// Scrollable area with a hidden scrollbar. The bottom edge fades out while there's more content below,
// which is the only hint that the list scrolls. Toggled through a data attribute so scrolling never re-renders.
export default function ScrollFade({ className, children }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      el.dataset.moreBelow = String(
        el.scrollHeight - el.scrollTop - el.clientHeight > 1,
      );
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    // Width changes can re-wrap rows and change how much is hidden
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
    // Re-check when the content changes (e.g. a live RSVP adds a row)
  }, [children]);

  return (
    <div
      ref={ref}
      className={cn(
        "no-scrollbar overflow-y-auto overscroll-contain data-[more-below=true]:[mask-image:linear-gradient(to_bottom,black_calc(100%_-_2.5rem),transparent)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
