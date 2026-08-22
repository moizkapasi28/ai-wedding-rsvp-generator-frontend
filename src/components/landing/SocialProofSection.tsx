export default function SocialProofSection() {
  return (
    <section className="py-10 border-y border-border/50 bg-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 opacity-50" />
      
      <div className="w-full max-w-none px-6 md:px-12 lg:px-24 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center gap-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center">
            Trusted by modern wedding planners and couples worldwide
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70 grayscale">
            {/* Placeholder Logos */}
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-6 h-6 bg-foreground rounded-sm rotate-45"></div>
              NEXUS
            </div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-6 h-6 rounded-full border-4 border-foreground"></div>
              Ovation
            </div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-6 h-6 bg-foreground rounded-tr-full rounded-bl-full"></div>
              Lumina
            </div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="flex gap-1"><div className="w-2 h-6 bg-foreground rounded-full"></div><div className="w-2 h-6 bg-foreground rounded-full"></div><div className="w-2 h-6 bg-foreground rounded-full"></div></div>
              Vanguard
            </div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-6 h-6 border-t-4 border-l-4 border-foreground rotate-45"></div>
              Apex Events
            </div>
          </div>
          
          <div className="flex items-center gap-8 md:gap-16 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">10,000+</p>
              <p className="text-sm text-muted-foreground mt-1">Weddings Managed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">98.5%</p>
              <p className="text-sm text-muted-foreground mt-1">RSVP Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">5M+</p>
              <p className="text-sm text-muted-foreground mt-1">Guests Checked In</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
