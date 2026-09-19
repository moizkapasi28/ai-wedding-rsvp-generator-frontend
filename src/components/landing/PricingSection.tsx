import { Link } from "react-router-dom";

// ponytail: there is no billing in this codebase, so these prices are
// placeholders. Set the real numbers (and wire up checkout) before launch.
// Every listed feature below does exist today.
const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "one wedding",
    summary: "Enough to run a small wedding end to end.",
    features: [
      "One wedding with all its ceremonies",
      "Up to 50 guests",
      "Excel and CSV import",
      "WhatsApp RSVP links",
      "Live RSVP dashboard",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Wedding",
    price: "₹1,499",
    period: "per wedding",
    summary: "One wedding, no limits on the guest list.",
    features: [
      "Unlimited guests and ceremonies",
      "Unlimited AI invitation cards",
      "AI header image and page builder",
      "RSVP deadline and reminders",
      "Dietary notes and plus-ones",
    ],
    cta: "Start free",
    featured: true,
  },
  {
    name: "Planner",
    price: "₹3,999",
    period: "per month",
    summary: "For planners running several weddings at once.",
    features: [
      "Everything in Wedding",
      "Unlimited weddings side by side",
      "Switch between weddings in one account",
      "Priority email support",
    ],
    cta: "Start free",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-[22ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
          Pay for the wedding, not a subscription.
        </h2>
        <p className="mt-6 max-w-[48ch] leading-relaxed text-muted-foreground">
          Start free and only pay once the guest list outgrows it. Planners
          running back-to-back seasons can pay monthly instead.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border p-8 ${
                plan.featured
                  ? "border-primary bg-card"
                  : "border-border bg-transparent"
              }`}
            >
              <h3 className="font-medium">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.summary}
              </p>

              <p className="mt-7 flex items-baseline gap-2">
                <span className="font-display text-4xl font-medium tracking-[-0.03em]">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </p>

              <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-7">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`mt-9 rounded-md px-5 py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground"
                    : "border border-border"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
