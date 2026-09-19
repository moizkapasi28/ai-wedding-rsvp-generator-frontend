import AuthNotice from "@/components/auth/AuthNotice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

export type VerifyEmailCardProps = HTMLAttributes<HTMLDivElement>;

export default function InvalidEmailVerificationLink({
  className,
  ...props
}: VerifyEmailCardProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-8", className)} {...props}>
      <AuthNotice tone="critical" title="Link expired or already used">
        Verification links are single-use and time-limited. Sign in and we'll
        send you a fresh one.
      </AuthNotice>

      <Button className="w-full" onClick={() => navigate("/signin")}>
        Back to sign in
      </Button>
    </div>
  );
}
