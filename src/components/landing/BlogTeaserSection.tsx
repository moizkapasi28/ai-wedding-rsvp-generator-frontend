import { formatPostDate, postsNewestFirst, readingMinutes } from "@/content/posts";
import { Link } from "react-router-dom";

export default function BlogTeaserSection() {
  const latest = postsNewestFirst.slice(0, 3);

  return (
    <section
      id="writing"
      className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-3">
          <h2 className="max-w-[16ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            What we've worked out.
          </h2>
          <Link
            to="/blog"
            className="mt-6 inline-block text-sm underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground"
          >
            Read the blog
          </Link>
        </div>

        <ul className="grid gap-x-10 gap-y-10 md:grid-cols-3 lg:col-span-9">
          {latest.map((post) => (
            <li key={post.slug} className="border-t border-border pt-6">
              <Link to={`/blog/${post.slug}`} className="group">
                <p className="text-xs text-muted-foreground">
                  {formatPostDate(post.date)}, {readingMinutes(post)} min read
                </p>
                <h3 className="mt-4 font-medium underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-border">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
