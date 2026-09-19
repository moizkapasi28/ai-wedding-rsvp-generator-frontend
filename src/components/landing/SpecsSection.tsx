// The dense reference list, for people who scroll looking for a reason to say
// no. Everything here ships today; anything that does not belongs in
// UpcomingSection instead.
const groups = [
  {
    area: "Invitations",
    items: [
      ["Card generation", "From design presets, or from a reference card you upload"],
      ["Design presets", "Classic elegant, modern minimalist, rustic botanical, vintage royal, moody avant-garde"],
      ["Paper and finish", "Smooth matte, deckled watercolour, heavy linen, frosted vellum, pearl shimmer"],
      ["Metallic accents", "Gold foil, silver filigree, rose gold leaf, holographic edge"],
      ["Edges and monogram", "Sharp, torn, gilded, scalloped or floral bleed; crest, serif initials, floral wreath or deco shield"],
      ["Header image", "A matching illustration generated for the top of the RSVP page"],
      ["Attire styling", "Lehenga and sherwani, saree and bandhgala, gown and tuxedo, hanbok, agbada and more"],
    ],
  },
  {
    area: "Guest list",
    items: [
      ["Bulk import", "Excel or CSV, processed in the background so a large file doesn't block you"],
      ["Per-guest record", "Name, email, mobile, side, group, notes"],
      ["Side", "Bride's side, groom's side, or both"],
      ["Group", "Family, relative, friend, colleague, employee, VIP or other"],
      ["Accommodation", "Whether a guest needs a room, and the address they're staying at"],
      ["Search and filters", "Find anyone by name, ceremony or reply status"],
      ["Edit any time", "Add, change or remove a guest after invitations have gone out"],
    ],
  },
  {
    area: "Ceremonies",
    items: [
      ["Unlimited ceremonies", "Mehendi, Haldi, Sangeet, Reception, or whatever you call yours"],
      ["Per-ceremony invites", "A different set of guests for each one"],
      ["Venue and map", "Address with a map pin, looked up as you type"],
      ["Date and time", "Held per ceremony, shown to the guests invited to it"],
      ["Side of the family", "Each ceremony can belong to one side or both"],
      ["Live stats per ceremony", "Attending, maybe, declined, pending and a completion percentage"],
    ],
  },
  {
    area: "RSVPs",
    items: [
      ["Personal link", "A unique link per guest, per ceremony"],
      ["Sent over WhatsApp", "A prepared message from your own number"],
      ["Three answers", "Attending, maybe, or can't make it"],
      ["Party size", "How many people that guest is bringing"],
      ["Meal preference", "Vegetarian, non-vegetarian, vegan, eggetarian, lactose free, gluten free or other"],
      ["Song request", "For the ceremonies where it makes sense"],
      ["Note to the couple", "Free text, straight to you"],
      ["Choose the questions", "Turn each question on or off per ceremony"],
      ["RSVP deadline", "A date after which replies close"],
      ["Reminders", "A first and a final reminder to whoever hasn't answered"],
      ["Changes of mind", "Guests reopen their link and change the answer until the deadline"],
      ["No account needed", "Guests never sign up, sign in, or install anything"],
    ],
  },
  {
    area: "Dashboard",
    items: [
      ["Live updates", "Replies appear without refreshing"],
      ["Headline counts", "Invited, attending, awaiting reply, needing accommodation"],
      ["Per-ceremony progress", "The confirmed, maybe, declined and pending split for each"],
      ["Meal breakdown", "Dietary preferences across everyone attending"],
      ["Guests by side", "How the confirmed list splits between the two families"],
      ["Replies over time", "Daily response counts, so you can see if a reminder landed"],
      ["Recent replies", "The last answers as they come in, with who said what"],
    ],
  },
  {
    area: "Account",
    items: [
      ["Multiple weddings", "Run several at once and switch between them"],
      ["Email verification", "Accounts are verified before they can be used"],
      ["Password reset", "Self-service, by email"],
      ["Your own RSVP page", "A page per wedding at its own address"],
    ],
  },
];

export default function SpecsSection() {
  return (
    <section
      id="specs"
      className="border-t border-border px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <h2 className="max-w-[18ch] text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem] lg:col-span-4">
            All of it, in one list.
          </h2>
          <p className="max-w-[52ch] leading-relaxed text-muted-foreground lg:col-span-6 lg:col-start-7">
            Everything below works today. If you are the sort of person who
            scrolls to the specification before signing up for anything, this
            part is for you.
          </p>
        </div>

        <div className="mt-16 space-y-14">
          {groups.map((group) => (
            <div
              key={group.area}
              className="grid gap-x-16 gap-y-6 lg:grid-cols-12"
            >
              <h3 className="text-xl font-medium tracking-tight lg:col-span-3">
                {group.area}
              </h3>
              <dl className="lg:col-span-9">
                {group.items.map(([term, description]) => (
                  <div
                    key={term}
                    className="grid gap-x-10 gap-y-1 border-t border-border py-4 last:border-b sm:grid-cols-12"
                  >
                    <dt className="text-sm font-medium sm:col-span-4">
                      {term}
                    </dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground sm:col-span-8">
                      {description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
