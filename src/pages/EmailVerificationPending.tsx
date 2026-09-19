import EmailVerificationPendingCard from "@/components/VerificationPendingCard";

export default function EmailVerificationPending() {
  // The card owns its own AuthLayout: it reads the email out of router state
  // and redirects when there isn't one, so it has to render nothing at all.
  return <EmailVerificationPendingCard />;
}
