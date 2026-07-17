import { Wand2, Send, CheckCircle } from "lucide-react";

const steps = [
  {
    title: "1. Setup your Wedding & Events",
    description: "Create your wedding profile and add all the related events (rehearsals, receptions) you want your guests to know about.",
    icon: Wand2,
  },
  {
    title: "2. Generate AI Invites",
    description: "Use our AI to craft the perfect personalized invite card, saving you time from starting from scratch.",
    icon: Send,
  },
  {
    title: "3. Track RSVPs & Dietary Needs",
    description: "Watch the responses roll in on your dashboard, complete with attendance stats and dietary breakdowns.",
    icon: CheckCircle,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container px-4 md:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How RSVP Genius works
          </h2>
          <p className="text-lg text-muted-foreground">
            We've reimagined wedding planning for the modern era. Three simple steps to complete peace of mind.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 shadow-sm relative">
                <step.icon className="w-10 h-10 text-primary" />
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-md">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
