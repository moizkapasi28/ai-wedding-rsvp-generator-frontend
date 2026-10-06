import { useEffect, useState } from "react";

// The current time, re-read on an interval. For text like "3 minutes ago" that has to keep
// moving on a page nobody is touching: one clock per page, passed down, so every row agrees
// and the components that format it stay pure.
export const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
