import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { HTMLAttributes } from "react";

export interface VerifyEmailCardProps extends HTMLAttributes<HTMLDivElement> {}

export default function EmailVerificationInProgressCard({
  className,
  ...props
}: VerifyEmailCardProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="w-full max-w-md z-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-4 pt-6">
          {/* Changed color theme to standard primary/indigo context with high visibility spinner */}
          <div className="mx-auto bg-linear-to-br from-primary/20 to-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-1 shadow-inner border border-primary/10">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Verifying Your Email
          </CardTitle>
          <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
            Please wait while we validate your security token and update your
            account status.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Informational Progress Box */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Securing your details...
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Do not refresh or close this window. You will be redirected
                automatically once the process completes successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
