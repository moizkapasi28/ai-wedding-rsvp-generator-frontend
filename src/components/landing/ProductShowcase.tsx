import { CheckCircle2 } from "lucide-react";

export default function ProductShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            See WedNexa in Action
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the platform designed to give you total control over your guest CRM and beautiful AI designs.
          </p>
        </div>

        {/* Feature 1: CRM (Image Right) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 max-w-[1800px] mx-auto">
          <div className="flex-1 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              Guest CRM & Tracking
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              A comprehensive overview of your entire guest list.
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Import hundreds of guests via CSV in seconds. Track attendance across multiple sub-events, edit guest details, and see real-time RSVP updates all from one sleek, centralized CRM dashboard.
            </p>
            <ul className="space-y-4">
              {[
                "Bulk import via Excel/CSV files",
                "Track RSVPs for specific sub-events (e.g. Sangeet, Reception)",
                "Full Guest CRM (add, edit, view, delete)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 order-1 lg:order-2 w-full">
            <div className="glow">
              <div className="glass-card p-2 rounded-2xl border border-white/10 relative">
                {/* Browser Top Bar Fake */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5 rounded-t-xl">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <img 
                  src="/mockups/hero.jpg" 
                  alt="WedNexa Guest CRM" 
                  className="w-full h-auto rounded-b-xl border-t-0 shadow-2xl" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: AI Design Studio (Image Left) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-[1800px] mx-auto">
          <div className="flex-1 w-full">
            <div className="glow">
              <div className="glass-card p-2 rounded-2xl border border-white/10 relative">
                {/* Browser Top Bar Fake */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5 rounded-t-xl">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <img 
                  src="/mockups/rsvp.jpg" 
                  alt="WedNexa AI Design & Page Builder" 
                  className="w-full h-auto rounded-b-xl border-t-0 shadow-2xl" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6">
              AI Design & Page Builder
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Breathtaking AI-generated designs & custom layouts.
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Create a personalized AI profile image for the header of your RSVP page, generate custom wedding cards using AI, and configure the layout and formatting of the page your guests interact with.
            </p>
            <ul className="space-y-4">
              {[
                "AI-generated RSVP profile headers & custom wedding cards",
                "Advanced Page Builder for layout and text formatting",
                "QR Code check-in integration (Coming Soon)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
