import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      <div className="container px-4 md:px-8 mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>The smartest way to manage your wedding</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">AI Wedding RSVPs</span> in seconds.
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          Generate custom AI invite cards, track RSVPs seamlessly, and manage your guest list across multiple events with the power of Artificial Intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
          <Button size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-md rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300 group">
            <Link to="/signup">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-md rounded-full">
            <Link to="#features">Explore Features</Link>
          </Button>
        </div>

        {/* Dashboard Preview Image Placeholder */}
        <div className="relative w-full max-w-5xl mx-auto rounded-xl border border-border/50 bg-background/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both ring-1 ring-white/10">
          <div className="absolute top-0 w-full h-10 bg-muted/30 border-b flex items-center px-4 gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="pt-10 p-2 md:p-4 bg-muted/10">
             <img 
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-lg shadow-sm border border-border/50 opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
