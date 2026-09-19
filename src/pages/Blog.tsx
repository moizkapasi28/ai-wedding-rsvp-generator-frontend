import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import {
  formatPostDate,
  postsNewestFirst,
  readingMinutes,
} from "@/content/posts";
import { Link } from "react-router-dom";

export default function Blog() {
  const [lead, ...rest] = postsNewestFirst;

  return (
    <div className="landing flex min-h-screen flex-col overflow-x-hidden bg-background selection:bg-primary/30">
      <Header />

      <main className="flex-1">
        <section className="px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40 lg:px-16">
          <div className="mx-auto w-full max-w-[1440px]">
            <h1 className="max-w-[20ch] text-[2.6rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              Notes on getting a wedding counted.
            </h1>
            <p className="mt-6 max-w-[54ch] leading-relaxed text-muted-foreground md:text-lg">
              What actually goes wrong between sending the invitations and
              knowing who is coming, and what to do about it.
            </p>
          </div>
        </section>

        <section className="border-t border-border px-6 py-16 md:px-10 md:py-20 lg:px-16">
          <div className="mx-auto w-full max-w-[1440px]">
            <Link
              to={`/blog/${lead.slug}`}
              className="group grid gap-8 lg:grid-cols-12 lg:gap-x-16"
            >
              <p className="text-sm text-muted-foreground lg:col-span-3">
                {formatPostDate(lead.date)}
                <span className="block">{readingMinutes(lead)} min read</span>
              </p>
              <div className="lg:col-span-9">
                <h2 className="max-w-[24ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-border sm:text-[2.75rem]">
                  {lead.title}
                </h2>
                <p className="mt-5 max-w-[62ch] leading-relaxed text-muted-foreground">
                  {lead.summary}
                </p>
              </div>
            </Link>
          </div>
        </section>

        <section className="border-t border-border px-6 py-16 md:px-10 md:py-20 lg:px-16">
          <div className="mx-auto w-full max-w-[1440px]">
            <ul>
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group grid gap-x-16 gap-y-3 border-b border-border py-8 lg:grid-cols-12"
                  >
                    <p className="text-sm text-muted-foreground lg:col-span-3">
                      {formatPostDate(post.date)}
                      <span className="block">
                        {readingMinutes(post)} min read
                      </span>
                    </p>
                    <div className="lg:col-span-9">
                      <h2 className="max-w-[34ch] text-xl font-medium tracking-tight underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-border">
                        {post.title}
                      </h2>
                      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                        {post.summary}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-card px-6 py-20 md:px-10 md:py-24 lg:px-16">
          <div className="mx-auto w-full max-w-[1440px]">
            <h2 className="max-w-[20ch] text-3xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-[2.75rem]">
              Every one of these is a problem WeddlyAI solves.
            </h2>
            <Link
              to="/signup"
              className="mt-9 inline-block rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
