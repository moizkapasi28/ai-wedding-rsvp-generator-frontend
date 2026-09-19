import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "positive" | "critical";

const toneRule: Record<Tone, string> = {
  neutral: "border-border",
  positive: "border-primary",
  critical: "border-destructive",
};

/**
 * Replaces the four one-off tinted boxes the auth screens each had. A rule
 * carries the tone; the text stays on the page's own colours.
 */
export default function AuthNotice({
  tone = "neutral",
  title,
  children,
}: {
  tone?: Tone;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("border-l-2 pl-5", toneRule[tone])}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}
