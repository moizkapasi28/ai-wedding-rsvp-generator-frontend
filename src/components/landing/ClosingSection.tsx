import { Link } from "react-router-dom";

export default function ClosingSection() {
  return (
    <section className="border-y border-border bg-card px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-[20ch] text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl">
          Set the date, and let us handle the replies.
        </h2>
        <p className="mt-7 max-w-[44ch] leading-relaxed text-muted-foreground">
          Create an account, add your wedding, and send the first invitation
          today.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            to="/signup"
            className="rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Create an account
          </Link>
          <Link
            to="/signin"
            className="text-sm underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
