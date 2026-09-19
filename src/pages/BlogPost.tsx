import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import {
  formatPostDate,
  getPost,
  postsNewestFirst,
  readingMinutes,
  type Block,
} from "@/content/posts";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function PostBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h":
      return (
        <h2 className="mt-14 text-xl font-medium tracking-tight first:mt-0">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="mt-6">
          {block.items.map((item) => (
            <li
              key={item}
              className="border-t border-border py-4 leading-relaxed text-muted-foreground last:border-b"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-12 border-l-2 border-primary pl-6 text-xl leading-relaxed tracking-tight">
          {block.text}
        </blockquote>
      );
    default:
      return (
        <p className="mt-6 leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const more = postsNewestFirst.filter((other) => other.slug !== slug).slice(0, 3);

  return (
    <div className="landing flex min-h-screen flex-col overflow-x-hidden bg-background selection:bg-primary/30">
      <Header />

      <main className="flex-1">
        {!post ? (
          <section className="px-6 pb-24 pt-40 md:px-10 lg:px-16">
            <div className="mx-auto w-full max-w-[1440px]">
              <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-5xl">
                We don't have that one.
              </h1>
              <p className="mt-6 max-w-[48ch] leading-relaxed text-muted-foreground">
                That link doesn't match anything we've published. Everything we
                have is on the blog.
              </p>
              <Link
                to="/blog"
                className="mt-9 inline-block rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Read the blog
              </Link>
            </div>
          </section>
        ) : (
          <>
            <article className="px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40 lg:px-16">
              <div className="mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-12 lg:gap-x-16">
                <div className="lg:col-span-3">
                  <Link
                    to="/blog"
                    className="text-sm text-muted-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-foreground"
                  >
                    All posts
                  </Link>
                  <p className="mt-8 text-sm text-muted-foreground">
                    {formatPostDate(post.date)}
                    <span className="block">
                      {readingMinutes(post)} min read
                    </span>
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h1 className="max-w-[22ch] text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] sm:text-5xl">
                    {post.title}
                  </h1>
                  <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>

                  <div className="mt-14 max-w-[68ch] border-t border-border pt-12">
                    {post.body.map((block, index) => (
                      <PostBlock key={index} block={block} />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <section className="border-t border-border bg-card px-6 py-20 md:px-10 md:py-24 lg:px-16">
              <div className="mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-12 lg:gap-x-16">
                <h2 className="max-w-[18ch] text-3xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-[2.5rem] lg:col-span-5">
                  This is the part WeddlyAI does for you.
                </h2>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="max-w-[48ch] leading-relaxed text-muted-foreground">
                    Per-ceremony guest lists, a personal RSVP link for every
                    guest on WhatsApp, and a count that keeps itself. Free for
                    your first wedding.
                  </p>
                  <Link
                    to="/signup"
                    className="mt-8 inline-block rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Start free
                  </Link>
                </div>
              </div>
            </section>

            <section className="border-t border-border px-6 py-16 md:px-10 md:py-20 lg:px-16">
              <div className="mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-12 lg:gap-x-16">
                <h2 className="text-xl font-medium tracking-tight lg:col-span-3">
                  Keep reading
                </h2>
                <ul className="grid gap-x-10 gap-y-8 md:grid-cols-3 lg:col-span-9">
                  {more.map((other) => (
                    <li key={other.slug} className="border-t border-border pt-6">
                      <Link to={`/blog/${other.slug}`} className="group">
                        <h3 className="font-medium underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-border">
                          {other.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {other.summary}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
