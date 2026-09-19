import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "How it works", href: "/#programme" },
  { name: "What's next", href: "/#upcoming" },
  { name: "Reviews", href: "/#reviews" },
  { name: "Pricing", href: "/#pricing" },
];

const blogLink = { name: "Blog", to: "/blog" };

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-6 transition-colors duration-300 md:px-10 lg:px-16 ${
        isScrolled || menuOpen
          ? "border-b border-border bg-background/95 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between py-4 md:py-5">
        <Link to="/">
          <Logo markClassName="h-9" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {link.name}
            </a>
          ))}
          <Link
            to={blogLink.to}
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {blogLink.name}
          </Link>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            to="/signin"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="-mx-6 border-t border-border bg-background px-6 pb-6 pt-2 md:-mx-10 md:px-10 lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="border-b border-border py-3 text-base"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link
              to={blogLink.to}
              className="border-b border-border py-3 text-base"
              onClick={() => setMenuOpen(false)}
            >
              {blogLink.name}
            </Link>
          </nav>
          <div className="mt-6 flex items-center gap-4">
            <Link
              to="/signup"
              className="flex-1 rounded-md bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Start free
            </Link>
            <Link
              to="/signin"
              className="px-2 text-sm text-muted-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
