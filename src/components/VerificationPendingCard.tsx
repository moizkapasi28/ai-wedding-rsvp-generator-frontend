import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResendEmailVerification } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { ResendVerificationEmailRequest } from "@/validations/auth.validation";
import { Inbox, MailQuestion, RefreshCw } from "lucide-react";
import { useEffect, type HTMLAttributes } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export interface VerifyEmailCardProps extends HTMLAttributes<HTMLDivElement> {}

export default function EmailVerificationPendingCard({
  className,
  ...props
}: VerifyEmailCardProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state as { email?: string } | null)?.email;

  const { mutateAsync, isPending } = useResendEmailVerification();

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  if (!email) {
    return null;
  }

  const handleResendVerificationEmail = () => {
    mutateAsync({ email } as ResendVerificationEmailRequest);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="w-full max-w-md z-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-4 pt-6">
          <div className="mx-auto bg-linear-to-br from-amber-500/20 to-amber-500/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-1 shadow-inner border border-amber-500/10">
            <MailQuestion className="w-7 h-7 text-amber-600 dark:text-amber-400 drop-shadow-sm" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
            We have sent a confirmation link to your registered email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <Inbox className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
                  Check your inbox
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Click the confirmation link inside the email to fully activate
                  your account. If you cannot find it, please make sure to check
                  your Spam or Junk folders.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full gap-2 font-medium"
              variant="outline"
              onClick={handleResendVerificationEmail}
              disabled={isPending}
            >
              <RefreshCw
                className={cn("h-4 w-4", isPending && "animate-spin")}
              />
              {isPending ? "Sending..." : "Resend Verification Link"}
            </Button>
            <div className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Back to login?{" "}
              <Link
                to="/signin"
                className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
