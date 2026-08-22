import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    description: "Perfect for couples planning their big day.",
    price: "$29",
    period: "/event",
    features: [
      "Up to 150 guests",
      "Smart RSVP tracking",
      "Standard email invitations",
      "Basic dashboard analytics",
      "Email support"
    ],
    cta: "Start Free Trial",
    recommended: false,
  },
  {
    name: "Pro",
    description: "Ideal for professional wedding planners.",
    price: "$79",
    period: "/month",
    features: [
      "Unlimited guests",
      "AI no-show prediction",
      "Automated SMS & Email flows",
      "QR Code Check-in",
      "Custom branding",
      "Priority support"
    ],
    cta: "Get Started",
    recommended: true,
  },
  {
    name: "Enterprise",
    description: "For agencies managing multiple clients and weddings.",
    price: "$199",
    period: "/month",
    features: [
      "Everything in Pro",
      "Multi-host collaboration",
      "Dedicated account manager",
      "API access",
      "Advanced custom reporting",
      "White-label options"
    ],
    cta: "Contact Sales",
    recommended: false,
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="w-full max-w-none px-6 md:px-12 lg:px-24 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your needs. No hidden fees, ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative glass-card rounded-3xl p-8 flex flex-col h-full ${
                plan.recommended 
                  ? "border-primary/50 shadow-2xl shadow-primary/20 md:-translate-y-4 bg-background/80" 
                  : "border-white/10 hover:border-white/20 bg-background/40"
              } transition-all duration-300`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground font-medium">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 shrink-0 ${plan.recommended ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-center transition-all ${
                  plan.recommended
                    ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                    : "bg-white/5 text-foreground border border-white/10 hover:bg-white/10"
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
