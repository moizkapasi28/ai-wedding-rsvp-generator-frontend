import * as React from "react";

// Phones get the drawer; tablets from 768px up get a real sidebar (an icon
// rail by default, see AppLayout) rather than a sheet they must open each time.
const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

// Reads the media query straight from the browser, so there's no effect and no wrong first render
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
