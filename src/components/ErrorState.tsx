import { Button } from "@/components/ui/button";
import { isLoggedInAtom } from "@/store/store";
import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Shared full-screen layout for the error pages (general / not found / maintenance). */
export default function ErrorState({
  code,
  title,
  body,
  action,
  home = true,
}: {
  code: string;
  title: string;
  body: string;
  action?: ReactNode;
  home?: boolean;
}) {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <p className="font-display text-6xl font-medium tracking-[-0.04em] text-muted-foreground/40 sm:text-7xl">
        {code}
      </p>
      <h1 className="mt-6 font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {home && (
          <Button asChild>
            <Link to={isLoggedIn ? "/weddings" : "/"}>
              {isLoggedIn ? "Back to weddings" : "Back home"}
            </Link>
          </Button>
        )}
        {action}
      </div>
    </main>
  );
}
