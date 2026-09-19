import AuthNotice from "@/components/auth/AuthNotice";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { HTMLAttributes } from "react";

export type VerifyEmailCardProps = HTMLAttributes<HTMLDivElement>;

export default function EmailVerificationInProgressCard({
  className,
  ...props
}: VerifyEmailCardProps) {
  return (
    <div className={cn("space-y-8", className)} {...props}>
      <p className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Confirming your link
      </p>

      <AuthNotice title="Keep this tab open">
        You'll be sent on automatically as soon as it's done. Nothing is lost if
        it takes a few seconds.
      </AuthNotice>
    </div>
  );
}
