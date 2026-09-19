import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/SignUpForm";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <AuthLayout
      wide
      title="Start with your first wedding."
      description="Set it up, add the ceremonies, and send the first invitation today. Your first wedding is free."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
