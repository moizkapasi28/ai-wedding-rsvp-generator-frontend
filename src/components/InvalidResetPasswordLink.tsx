import AuthNotice from "@/components/auth/AuthNotice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

export type InvalidResetPasswordLinkProps = HTMLAttributes<HTMLDivElement>;

export default function InvalidResetPasswordLink({
  className,
  ...props
}: InvalidResetPasswordLinkProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-8", className)} {...props}>
      <AuthNotice tone="critical" title="Link expired or already used">
        Reset links work once and only for a short window, so that nobody else
        can use an old one to get into your account.
      </AuthNotice>

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={() => navigate("/forgot-password")}
        >
          Send me a new link
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate("/signin")}
        >
          Back to sign in
        </Button>
      </div>
    </div>
  );
}
