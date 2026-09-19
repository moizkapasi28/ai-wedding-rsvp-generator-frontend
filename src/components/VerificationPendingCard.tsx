import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";
import { Button } from "@/components/ui/button";
import { useResendEmailVerification } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { ResendVerificationEmailRequest } from "@/validations/auth.validation";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function EmailVerificationPendingCard() {
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
    <AuthLayout
      title="Check your inbox."
      description={
        <>
          We've sent a confirmation link to{" "}
          <span className="text-foreground">{email}</span>. Open it and your
          account is ready.
        </>
      }
      footer={
        <>
          Already confirmed?{" "}
          <Link
            to="/signin"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        <AuthNotice title="Not there?">
          It can take a minute to arrive. Check your spam or promotions folder
          before asking for another.
        </AuthNotice>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResendVerificationEmail}
          disabled={isPending}
        >
          <RefreshCw className={cn("size-4", isPending && "animate-spin")} />
          {isPending ? "Sending" : "Send it again"}
        </Button>
      </div>
    </AuthLayout>
  );
}
