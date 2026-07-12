import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowRight, MailX } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

export interface VerifyEmailCardProps extends HTMLAttributes<HTMLDivElement> { }

export default function InvalidEmailVerificationLink({
  className,
  ...props
}: VerifyEmailCardProps) {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/signin");
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="w-full max-w-md z-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-4 pt-6">
          {/* Changed color theme to destructive/red context */}
          <div className="mx-auto bg-linear-to-br from-destructive/20 to-destructive/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-1 shadow-inner border border-destructive/10">
            <MailX className="w-7 h-7 text-destructive drop-shadow-sm" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Verification Failed
          </CardTitle>
          <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
            The verification link is invalid, has expired, or has already been
            used.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Destructive Warning Box */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 dark:bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive-foreground dark:text-red-400">
                  Link Expired or Invalid
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  For security reasons, email confirmation links expire after a
                  short period. Please request a new activation link to verify
                  your account.
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-2">
            <Button
              type="button"
              className="w-full gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              variant="ghost"
              onClick={handleBackToLogin}
            >
              Back to Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
