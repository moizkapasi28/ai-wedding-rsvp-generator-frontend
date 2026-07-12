import { authService } from "@/api/auth.service";
import EmailVerificationInProgressCard from "@/components/EmailVerificationInProgressCard";
import InvalidEmailVerificationLink from "@/components/InvalidEmailVerificationLink";
import VerifyEmailCard from "@/components/VerifyEmailCard";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");
      return authService.verifyEmail({ token });
    },
    enabled: !!token,
    retry: false,
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div
          className="absolute top-[-10%] left-[-10%] w-150 h-150 rounded-full bg-primary/15 dark:bg-primary/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-125 h-125 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "1s" }}
        />
      </div>
      {!token && <InvalidEmailVerificationLink />}
      {token && isPending && <EmailVerificationInProgressCard />}
      {token && isSuccess && !isPending && <VerifyEmailCard />}
      {token && isError && <InvalidEmailVerificationLink />}
    </div>
  );
}
