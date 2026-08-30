import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] max-w-4xl opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Wedding Guest Management is Here</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Beautiful AI Wedding Cards & <br className="hidden md:block" />
            <span className="text-gradient">Effortless RSVPs</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Design stunning AI-generated wedding cards and profile headers for your RSVP page. Effortlessly manage your guest list and track RSVPs in real-time for your big day.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <div className="glow w-full sm:w-auto">
              <Link
                to="/signup"
                className="relative flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-background border border-primary/50 rounded-full hover:bg-primary/10 transition-colors w-full"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <Link
              to="#how-it-works"
              className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-foreground bg-white/5 border border-border rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              See How it Works
            </Link>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="glow">
            <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden glass-card p-2 md:p-4 border border-white/10">
              <img
                src="/mockups/hero.jpg"
                alt="WedNexa AI Guest Management Dashboard"
                className="w-full h-auto rounded-xl md:rounded-2xl border border-white/5 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
