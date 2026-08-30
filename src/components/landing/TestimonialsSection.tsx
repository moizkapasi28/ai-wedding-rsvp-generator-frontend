import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Eleanor Vance",
    role: "Lead Wedding Planner",
    company: "Vance & Co. Events",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    quote: "WedNexa has completely transformed how I manage weddings. The AI wedding card generator allowed us to create a stunning custom design from a reference in seconds.",
  },
  {
    name: "Marcus Thorne",
    role: "Groom-to-be",
    company: "Married in 2024",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    quote: "Managing a 300-person wedding used to be a spreadsheet nightmare. With WedNexa's real-time RSVP dashboard, we had zero stress about who was actually coming.",
  },
  {
    name: "Sarah Jenkins",
    role: "Mother of the Bride",
    company: "Jenkins Family",
    image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    quote: "The AI profile image generator for the RSVP page added such a beautiful, personalized touch to our digital invites. The guests absolutely loved it!",
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white/5 border-y border-border/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-none px-6 md:px-12 lg:px-24 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Loved by Event Professionals
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. See what top planners and hosts are saying about WedNexa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-8 rounded-2xl flex flex-col h-full border border-white/10 hover:border-primary/30 transition-colors duration-300">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <blockquote className="text-foreground text-lg leading-relaxed flex-1 mb-8">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full border-2 border-primary/20"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
