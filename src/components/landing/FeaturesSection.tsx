import {
  CalendarDays,
  FileSpreadsheet,
  QrCode,
  Settings,
  Sparkles,
  Users
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Design Generation",
    description: "Automatically generate custom, stunning wedding cards and beautiful profile header images for your RSVP landing pages using AI.",
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Guest CRM & Bulk Import",
    description: "Add, edit, view, and delete guest details. Import hundreds of guests instantly via Excel or CSV bulk uploads.",
    icon: <FileSpreadsheet className="w-6 h-6 text-indigo-400" />,
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    title: "Real-time RSVP Tracking",
    description: "Monitor and track exactly which guests have RSVP'd to which events in real-time on your dashboard.",
    icon: <Users className="w-6 h-6 text-blue-400" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    title: "Multi-Event Management",
    description: "Create sub-events (Reception, Haldi, Sangeet) under your main wedding hub so guests can RSVP to specific functions.",
    icon: <CalendarDays className="w-6 h-6 text-emerald-400" />,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "Customizable RSVP Pages",
    description: "Use our Page Builder to configure the layout, text formatting, and design settings of the page your guests will interact with.",
    icon: <Settings className="w-6 h-6 text-rose-400" />,
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    title: "QR Code Check-in",
    description: "Scan QR codes at the door for lightning-fast, seamless guest arrival and real-time attendance tracking.",
    icon: <QrCode className="w-6 h-6 text-amber-400" />,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "Coming Soon"
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background blur-2xl" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Everything you need for a <span className="text-gradient">flawless wedding</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            WedNexa combines powerful AI design tools with a comprehensive guest CRM, giving you everything you need to invite and organize guests like a pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative glass-card p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110 ${feature.bg} ${feature.border}`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors pr-24">
                {feature.title}
              </h3>

              {feature.badge && (
                <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {feature.badge}
                </span>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
