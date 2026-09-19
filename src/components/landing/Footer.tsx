import { postsNewestFirst } from "@/content/posts";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

// Anchors are root-relative so they also work from /blog, where a bare "#specs"
// would resolve against the blog URL.
const columns = [
  {
    heading: "The platform",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Ceremonies", href: "/#ceremonies" },
      { label: "Invitation cards", href: "/#invitations" },
      { label: "Guest list", href: "/#guest-list" },
      { label: "What guests see", href: "/#guest-experience" },
      { label: "Dashboard", href: "/#dashboard" },
      { label: "Everything included", href: "/#specs" },
    ],
  },
  {
    heading: "Before you start",
    links: [
      { label: "How it works", href: "/#programme" },
      { label: "Being built now", href: "/#upcoming" },
      { label: "What people say", href: "/#reviews" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Questions", href: "/#faq" },
    ],
  },
];

const account = [
  { label: "Create an account", to: "/signup" },
  { label: "Sign in", to: "/signin" },
  { label: "Reset your password", to: "/forgot-password" },
];

const linkClass =
  "text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline";

export default function Footer() {
  const latest = postsNewestFirst.slice(0, 3);

  return (
    <footer className="border-t border-border px-6 pb-10 pt-16 md:px-10 md:pt-20 lg:px-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/">
              <Logo markClassName="h-9" />
            </Link>
            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
              Invitation cards, a guest list per ceremony, and a headcount that
              keeps itself — from the first card you send to the last person
              through the door.
            </p>
            <p className="mt-6 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
              Built for weddings that run over several days, with a different
              set of people at each one.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="lg:col-span-2">
              <h2 className="text-sm font-medium">{column.heading}</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h2 className="text-sm font-medium">Your account</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {account.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-medium">
              <Link to="/blog" className="underline-offset-4 hover:underline">
                Writing
              </Link>
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              {latest.map((post) => (
                <li key={post.slug}>
                  <Link to={`/blog/${post.slug}`} className={linkClass}>
                    {post.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/blog" className={linkClass}>
                  All posts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WeddlyAI</p>
          <p>Made for weddings that take more than one day.</p>
        </div>
      </div>
    </footer>
  );
}
