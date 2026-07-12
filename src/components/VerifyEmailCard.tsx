import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MailCheckIcon, ShieldCheck } from "lucide-react";
import type { HTMLAttributes } from "react";

export interface VerifyEmailCardProps extends HTMLAttributes<HTMLDivElement> {}

export default function VerifyEmailCard({
  className,
  ...props
}: VerifyEmailCardProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="w-full max-w-md z-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-4 pt-6">
          <div className="mx-auto bg-linear-to-br from-primary/20 to-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-1 shadow-inner border border-primary/10">
            <MailCheckIcon className="w-7 h-7 text-primary drop-shadow-sm" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Email Verified Successfully
          </CardTitle>
          <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
            Your identity has been confirmed. You can now securely log in to
            your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Status Breakdown Box */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 dark:bg-emerald-500/10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                  Account Activated
                </p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                  Full access to your dashboard, data, events and personalized
                  settings is now enabled.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
