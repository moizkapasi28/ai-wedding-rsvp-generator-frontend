import AuthAside from "@/components/auth/AuthAside";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Sits under a rule at the foot of the form column. */
  footer?: ReactNode;
  /** Signup needs the extra room for its two-column fields. */
  wide?: boolean;
}

/**
 * On desktop the page is locked to one viewport and never scrolls; if a form
 * genuinely cannot fit (a short window, browser zoom) the form column scrolls
 * on its own rather than the document.
 *
 * On mobile the document scrolls normally instead, because a phone's dynamic
 * toolbar makes 100vh taller than the visible area — locking to it there would
 * clip the bottom of a long form. min-h-dvh tracks the real visible height, so
 * short pages still fill the screen without scrolling.
 */
export default function AuthLayout({
  title,
  description,
  children,
  footer,
  wide = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:h-screen lg:grid-cols-12 lg:overflow-hidden">
      <div className="flex min-h-dvh flex-col px-6 py-6 md:px-10 lg:col-span-7 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:px-16 lg:py-8">
        <Link
          to="/"
          className="shrink-0 self-start text-xl font-semibold tracking-[-0.03em]"
        >
          WeddlyAI
        </Link>

        <main className="flex flex-1 items-center py-8">
          <div className={cn("w-full", wide ? "max-w-xl" : "max-w-sm")}>
            <h1 className="text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </div>
        </main>

        <p className="shrink-0 text-xs text-muted-foreground">
          © {new Date().getFullYear()} WeddlyAI
        </p>
      </div>

      <AuthAside />
    </div>
  );
}
