import AuthNotice from "@/components/auth/AuthNotice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

export type VerifyEmailCardProps = HTMLAttributes<HTMLDivElement>;

export default function VerifyEmailCard({
  className,
  ...props
}: VerifyEmailCardProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-8", className)} {...props}>
      <AuthNotice tone="positive" title="Account active">
        Your dashboard, weddings, ceremonies and guest lists are all open to you
        now.
      </AuthNotice>

      <Button className="w-full" onClick={() => navigate("/signin")}>
        Sign in
      </Button>
    </div>
  );
}
