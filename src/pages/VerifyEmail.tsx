import AuthLayout from "@/components/auth/AuthLayout";
import EmailVerificationInProgressCard from "@/components/EmailVerificationInProgressCard";
import InvalidEmailVerificationLink from "@/components/InvalidEmailVerificationLink";
import VerifyEmailCard from "@/components/VerifyEmailCard";
import { useVerifyEmail } from "@/hooks/use-auth";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? null;

  const { isPending, isSuccess, isError } = useVerifyEmail(token);

  if (!token || isError) {
    return (
      <AuthLayout
        title="We couldn't verify that."
        description="The link is invalid, has already been used, or has expired. Sign in and we'll send you another one."
      >
        <InvalidEmailVerificationLink />
      </AuthLayout>
    );
  }

  if (isPending) {
    return (
      <AuthLayout
        title="Checking your link."
        description="This takes a moment. Leave the tab open while we confirm it."
      >
        <EmailVerificationInProgressCard />
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="You're verified."
        description="Your email is confirmed and the account is ready. Sign in and add your first wedding."
      >
        <VerifyEmailCard />
      </AuthLayout>
    );
  }

  return null;
}
