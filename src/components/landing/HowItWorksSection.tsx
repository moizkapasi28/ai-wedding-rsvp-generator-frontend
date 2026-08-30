import { CalendarPlus, Sparkles, Users, CheckSquare } from "lucide-react";

const steps = [
  {
    title: "Create Wedding Hub",
    description: "Set up your wedding details and create specific sub-events (Reception, Sangeet).",
    icon: <CalendarPlus className="w-6 h-6" />,
  },
  {
    title: "AI Design & Pages",
    description: "Generate stunning AI cards and customize your RSVP page layout in the builder.",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: "Import Guests",
    description: "Bulk import your guest list via CSV/Excel into our comprehensive Guest CRM.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Track RSVPs",
    description: "Watch RSVPs and specific event attendances update in real-time.",
    icon: <CheckSquare className="w-6 h-6" />,
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white/5 border-y border-border/50">
      <div className="w-full max-w-none px-6 md:px-12 lg:px-24 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How <span className="text-primary">WedNexa</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">
            From first invite to final headcount, we've streamlined the entire process into four simple steps.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-600 w-full opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative group">
                {/* Number Badge */}
                <div className="absolute -top-4 -right-2 md:right-8 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors z-20">
                  {index + 1}
                </div>
                
                {/* Icon Container */}
                <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mb-6 text-foreground group-hover:text-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 relative z-10 bg-background">
                  {step.icon}
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground px-4">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
