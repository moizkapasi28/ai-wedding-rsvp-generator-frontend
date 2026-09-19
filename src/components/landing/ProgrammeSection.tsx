const steps = [
  {
    title: "Create the wedding",
    body: "Add the wedding, then the ceremonies that sit under it.",
  },
  {
    title: "Design the invitation",
    body: "Generate the card and header, then set up the RSVP page.",
  },
  {
    title: "Bring in the guests",
    body: "Import your list and send each guest their own link.",
  },
  {
    title: "Watch the replies",
    body: "Every ceremony's count updates as guests respond.",
  },
];

export default function ProgrammeSection() {
  return (
    <section id="programme" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-[24ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
          Four steps, in this order.
        </h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-border pt-5">
              <p className="font-display text-3xl font-medium tracking-tight text-muted-foreground">
                {index + 1}
              </p>
              <h3 className="mt-6 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
