import { Link } from "react-router-dom";

// ponytail: there is no billing in this codebase. Free describes what every
// account really gets today (AI credits mirror AI_CREDIT_COST and the backend's
// starting balance of 100). Wedding and Planner are not on sale: their prices are
// placeholders, nothing enforces a plan limit yet, and they are labelled coming
// soon. Set the real numbers, wire up checkout and drop the labels before launch.
const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "available now",
    summary: "Everything WeddlyAI does today.",
    features: [
      "Your wedding with all its ceremonies",
      "Excel import from our template",
      "WhatsApp RSVP links, deadline and reminders",
      "Live RSVP dashboard",
      "100 AI credits: a card uses 10, a header image 5",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Wedding",
    price: "₹1,499",
    period: "per wedding · coming soon",
    summary: "Planned for one wedding with a long guest list.",
    features: [
      "Everything in Free",
      "Unlimited guests and ceremonies",
      "More AI credits for cards and header images",
    ],
    cta: "Start free",
    featured: true,
  },
  {
    name: "Planner",
    price: "₹3,999",
    period: "per month · coming soon",
    summary: "Planned for planners running several weddings at once.",
    features: [
      "Everything in Wedding",
      "Unlimited weddings side by side",
      "Priority email support",
    ],
    cta: "Start free",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[90rem]">
        <h2 className="max-w-[22ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
          Pay for the wedding, not a subscription.
        </h2>
        <p className="mt-6 max-w-[48ch] leading-relaxed text-muted-foreground">
          Every account is free today and starts with 100 AI credits for
          cards and header images. The paid plans are not on sale yet, and
          nothing is charged until they are.
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
