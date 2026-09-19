import AuthLayout from "@/components/auth/AuthLayout";
import InvalidResetPasswordLink from "@/components/InvalidResetPasswordLink";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  if (isError) {
    return (
      <AuthLayout
        title="That link has expired."
        description="Reset links are single-use and time-limited. Ask for a fresh one and it'll be in your inbox in a moment."
      >
        <InvalidResetPasswordLink />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password."
      description="Pick something you haven't used here before, then sign in with it."
      footer={
        <>
          Changed your mind?{" "}
          <Link
            to="/signin"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      <ResetPasswordForm token={token} setIsError={setIsError} />
    </AuthLayout>
  );
}
