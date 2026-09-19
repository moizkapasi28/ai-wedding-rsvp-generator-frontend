// ponytail: placeholder quotes. Swap these for real ones before launch — they
// are written to sound like this product, but nobody said them.
const reviews = [
  {
    quote:
      "We had four functions and three different guest lists. Everyone kept asking me who was coming to the Sangeet, and for the first time I could just read the number off my phone.",
    name: "Nandini Rao",
    role: "Bride, married February 2026",
  },
  {
    quote:
      "I uploaded the family spreadsheet, sent the links on WhatsApp that evening, and had a hundred and forty replies by the weekend. No phone calls.",
    name: "Sameer Qureshi",
    role: "Father of the groom",
  },
  {
    quote:
      "The card it generated from our reference went straight out without edits. I run six weddings a season and that is the part that normally costs me a week.",
    name: "Alisha Fernandes",
    role: "Wedding planner",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-x-16">
        <h2 className="max-w-[18ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem] lg:col-span-3">
          What couples and planners say.
        </h2>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3 lg:col-span-9">
          {reviews.map((review) => (
            <figure key={review.name} className="border-t border-border pt-6">
              <blockquote className="text-[0.95rem] leading-relaxed">
                {review.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                >
                  {initials(review.name)}
                </span>
                <span className="text-sm">
                  {review.name}
                  <span className="block text-xs text-muted-foreground">
                    {review.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
