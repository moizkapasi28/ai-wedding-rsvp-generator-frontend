import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back."
      description="Sign in to pick up where your guest list left off."
      footer={
        <>
          No account yet?{" "}
          <Link
            to="/signup"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
