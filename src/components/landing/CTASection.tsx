import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="w-full max-w-none px-6 md:px-12 lg:px-24 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto rounded-3xl p-1 relative overflow-hidden">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary background-animate rounded-3xl opacity-50" />
          
          <div className="bg-background rounded-3xl p-10 md:p-16 text-center relative z-10 glass-card">
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-6">
              Ready to host your <br />
              dream wedding?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of couples and planners using WedNexa to eliminate stress and deliver flawless experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="glow w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="relative flex items-center justify-center gap-2 px-10 py-4 text-base font-semibold text-white bg-primary rounded-full hover:opacity-90 transition-opacity w-full shadow-xl shadow-primary/25"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
