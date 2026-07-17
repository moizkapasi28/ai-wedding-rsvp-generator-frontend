import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              RSVP Genius
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden sm:block"
          >
            Features
          </Link>
          <Link
            to="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden sm:block"
          >
            How it Works
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/signin">Log in</Link>
            </Button>
            <Button asChild className="rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
