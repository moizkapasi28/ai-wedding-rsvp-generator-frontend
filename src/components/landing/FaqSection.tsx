import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do my guests need an account?",
    answer:
      "No. Each guest gets a link of their own. They open it, pick the ceremonies they are coming to, and that is the whole thing.",
  },
  {
    question: "Can I invite someone to one ceremony but not another?",
    answer:
      "Yes. Ceremonies are invited to separately, so a guest only ever sees the ones you asked them to. Each ceremony keeps its own count.",
  },
  {
    question: "How do I get my guest list in?",
    answer:
      "Upload an Excel or CSV file with names, phone numbers and any notes. You can also add and edit guests one at a time afterwards.",
  },
  {
    question: "How are the invitations sent?",
    answer:
      "WeddlyAI builds a WhatsApp message per guest with their own RSVP link in it. You send it from your own number, so it arrives from someone they know.",
  },
  {
    question: "What does the AI actually generate?",
    answer:
      "The invitation card itself and the header image on your RSVP page. You either pick from design presets — paper, foil, edging, monogram — or upload a card you like and let it work from that.",
  },
  {
    question: "When do QR attendance and the photo gallery arrive?",
    answer:
      "Both are in development and neither is included yet. Nothing on the paid plans depends on them — when they ship, they turn up in your account without you doing anything.",
  },
  {
    question: "What if a guest changes their mind?",
    answer:
      "They open the same link again and change their answer. Your dashboard updates as soon as they do, up until the RSVP deadline you set.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-x-16">
        <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem] lg:col-span-4">
          Questions people ask.
        </h2>

        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-t border-border last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[62ch] pb-6 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
