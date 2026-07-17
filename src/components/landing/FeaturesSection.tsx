import { Users, Sparkles, PieChart, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: "AI Invite Generation",
    description: "Instantly create personalized AI-generated invite cards for your wedding.",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Seamless Guest Tracking",
    description: "Manage your entire guest list in one place. Track meal preferences and RSVPs easily.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Dashboard Analytics",
    description: "Get detailed insights into your wedding stats with RSVP progress charts and dietary breakdowns.",
    icon: PieChart,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Multi-Event Management",
    description: "Organize not just the wedding, but all related events (rehearsal, reception) in one unified space.",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need for your special day
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-driven platform takes the stress out of wedding planning, giving you more time to focus on what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border-border/50 bg-background/50 backdrop-blur hover:border-primary/50 transition-colors duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bg}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
