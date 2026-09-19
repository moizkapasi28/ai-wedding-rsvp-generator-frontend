import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Let's get you back in."
      description="Tell us the email you signed up with and we'll send you a link to set a new password."
      footer={
        <>
          Remembered it?{" "}
          <Link
            to="/signin"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
