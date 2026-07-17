import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container px-4 md:px-8 mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:items-start max-w-xs text-center md:text-left">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">
              RSVP Genius
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The intelligent way to manage your wedding guests, RSVPs, and memories.
          </p>
        </div>
        
        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Product</h4>
            <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Legal</h4>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="container px-4 md:px-8 mx-auto mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RSVP Genius. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
