// Blog content lives here as data rather than markdown: there is no CMS, and
// these four block types cover everything the posts need without pulling in a
// markdown renderer.
export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Post {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, used for sorting and for the dateline. */
  date: string;
  body: Block[];
}

export const posts: Post[] = [
  {
    slug: "why-the-headcount-is-always-wrong",
    title: "Why the wedding headcount is always wrong",
    summary:
      "Every couple gives the caterer a number. Almost nobody gives them the right one. The reason is not carelessness — it is that the number lives in six places at once.",
    date: "2026-08-04",
    body: [
      {
        type: "p",
        text: "Ask a couple two weeks before the wedding how many people are coming and you will get a number. Ask where that number came from and you will get a pause. It came from a spreadsheet, which was built from a list in a notebook, which was updated after a phone call with an aunt, and then amended by a message sitting somewhere in a WhatsApp group with 61 unread messages.",
      },
      {
        type: "p",
        text: "The number is not wrong because anyone was careless. It is wrong because it never existed in one place long enough to be counted.",
      },
      { type: "h", text: "The six places a headcount hides" },
      {
        type: "ul",
        items: [
          "The original spreadsheet, now three versions old and emailed around as an attachment",
          "A WhatsApp group where people replied with a thumbs-up that nobody wrote down",
          "Verbal confirmations given to a parent, who remembers them but never recorded them",
          "The printed card list, which is who was invited, not who is coming",
          "A second list made for one specific function, because the main list did not fit",
          "The people who said yes months ago and then quietly stopped planning to come",
        ],
      },
      {
        type: "p",
        text: "Each of these is a reasonable thing to do on its own. Together they guarantee that no single person can answer the question. So the couple estimates, and the estimate is padded upwards, because running out of food is a catastrophe and over-ordering is only money.",
      },
      { type: "h", text: "What the padding costs" },
      {
        type: "p",
        text: "A 15% pad on a 300-person function is 45 plates. Catering runs roughly ₹800 to ₹2,500 a plate depending on the city and the menu, so that pad is somewhere between ₹36,000 and ₹112,500 — per function. Across four functions, the guessing stops being a rounding error and becomes a line item nobody put in the budget.",
      },
      {
        type: "p",
        text: "The pad does not even solve the problem, because the risk runs in both directions. Seating is planned on the estimate. So is the room block. So is the number of welcome kits printed with people's names on them.",
      },
      { type: "h", text: "The fix is boring" },
      {
        type: "p",
        text: "There is no clever solution here. The headcount becomes accurate the moment two things are true: every guest's answer is recorded in the same place, and every guest can answer without anyone having to transcribe it.",
      },
      {
        type: "p",
        text: "The second condition is the one people skip. If replies arrive as messages a human has to read and copy into a sheet, you have not removed the problem — you have moved it onto whoever owns the sheet. The answer has to land in the count by itself.",
      },
      {
        type: "quote",
        text: "The goal is not a better spreadsheet. It is never having to ask anybody whether we heard back from them.",
      },
      {
        type: "p",
        text: "When that holds, the number you read out on Thursday is the number of people who walk in on Saturday. Not because anyone got better at estimating, but because nobody is estimating.",
      },
    ],
  },
  {
    slug: "one-guest-list-per-ceremony",
    title: "A multi-day wedding is not one guest list",
    summary:
      "Treating a four-function wedding as a single list is the most common planning mistake, and the one that causes the most awkward conversations.",
    date: "2026-07-21",
    body: [
      {
        type: "p",
        text: "The Mehendi is forty people in somebody's home. The Sangeet is two hundred. The Reception is everyone your father has ever done business with. These are not one event with one guest list. They are four events that happen to share a couple.",
      },
      {
        type: "p",
        text: "Most tools do not understand this, so couples force it. They keep one list and add columns — a tick for Mehendi, a tick for Sangeet — and then discover that the ticks and the invitations have drifted apart.",
      },
      { type: "h", text: "What goes wrong" },
      {
        type: "ul",
        items: [
          "Someone invited only to the Reception receives details of the Haldi and assumes they are welcome",
          "A guest replies yes with no indication of which functions they mean",
          "The count for a small function gets contaminated by replies meant for a big one",
          "Nobody can say how many are coming to the Mehendi specifically — the one where the number matters most, because it is in a house",
        ],
      },
      {
        type: "p",
        text: "That last one is the expensive one. Intimate functions have the least tolerance for a bad estimate and are usually planned with the least data.",
      },
      { type: "h", text: "Invitations are per function, so lists should be too" },
      {
        type: "p",
        text: "The principle is simple: a guest should only ever see the functions they were actually invited to. Not a list with some of them greyed out — that tells them precisely what they were left out of. Just the ones that are theirs.",
      },
      {
        type: "p",
        text: "This also means a guest replies per function. Your cousin can come to the Sangeet and skip the Mehendi, and both facts get recorded separately, without a phone call. Each function keeps its own count, its own venue, its own timing and its own deadline.",
      },
      { type: "h", text: "Sides matter too" },
      {
        type: "p",
        text: "For most functions there is a bride's side and a groom's side, and the two families usually plan in parallel rather than together. Knowing that 180 of your 240 confirmed Sangeet guests come from one side is not trivia. It changes seating, it changes the room block, and it changes who you chase when the numbers look thin.",
      },
      {
        type: "p",
        text: "One wedding, four functions, four counts. That is how the wedding actually works, so that is how the list should work.",
      },
    ],
  },
  {
    slug: "stop-chasing-rsvps-on-whatsapp",
    title: "Stop chasing RSVPs on WhatsApp",
    summary:
      "WhatsApp is the right place to send a wedding invitation and the wrong place to collect the answer. The difference matters more than it sounds.",
    date: "2026-07-02",
    body: [
      {
        type: "p",
        text: "There is no argument about where invitations should go. In India, WhatsApp is where people are. An invitation sent there gets opened; an emailed one goes to a tab nobody visits. That part is settled.",
      },
      { type: "p", text: "The mistake is collecting the reply in the same place." },
      { type: "h", text: "Why replies rot in a chat" },
      {
        type: "p",
        text: "A reply in a chat is a sentence, written by a person, in whatever form they felt like. A thumbs-up. We will try. Count us in, four of us, but Papa might not make it. Every one of those needs a human to read it, decide what it means, and write it down somewhere else. That human is you, at eleven at night, four weeks before your own wedding.",
      },
      {
        type: "ul",
        items: [
          "Replies arrive in a stream mixed with every other message in the thread",
          "A reply in a group chat scrolls out of view within the hour",
          "There is no record of who has not replied — only of who has",
          "Half the answers are ambiguous and need a follow-up question",
          "Changes of mind arrive as a second message with no reference to the first",
        ],
      },
      {
        type: "p",
        text: "The third point is the important one. Chasing RSVPs is not about the people who replied. It is entirely about the people who did not, and a chat gives you no way to see them.",
      },
      { type: "h", text: "Send on WhatsApp, collect on a page" },
      {
        type: "p",
        text: "The version that works keeps WhatsApp as the delivery channel and moves the answer onto a page of its own. The guest gets a message from a number they recognise, with a link that is theirs. They tap it, they answer, and the answer lands in the count directly. No transcription, no interpretation.",
      },
      {
        type: "p",
        text: "It also inverts the chasing problem. Instead of scrolling a thread to work out who is missing, you look at a list of people who have not answered and remind exactly those people. A first reminder, and if the deadline is close, a final one.",
      },
      {
        type: "quote",
        text: "You are not trying to collect replies. You are trying to run out of people who have not replied.",
      },
      {
        type: "p",
        text: "The guest's experience barely changes — they still get a WhatsApp message from someone they know. Yours changes completely.",
      },
    ],
  },
  {
    slug: "what-to-ask-on-an-rsvp",
    title: "What to ask on an RSVP, and what to leave out",
    summary:
      "Every extra question costs you replies. Here is what is worth asking function by function, and what you should quietly drop.",
    date: "2026-06-16",
    body: [
      {
        type: "p",
        text: "An RSVP form is a negotiation. Every field you add gives you information you might use, and costs you some number of guests who start the form and do not finish it. Older guests abandon fastest — and older guests are usually the ones whose attendance you are least able to guess.",
      },
      { type: "h", text: "Always worth asking" },
      {
        type: "ul",
        items: [
          "Are you coming — with a real maybe option, because forcing a yes or no this early produces a yes you cannot trust",
          "How many people in your party, because one person saying yes can mean four plates",
        ],
      },
      {
        type: "p",
        text: "That is genuinely it for the questions that always earn their place. Everything else depends on the function.",
      },
      { type: "h", text: "Worth asking, sometimes" },
      {
        type: "ul",
        items: [
          "Meal preference — essential for a seated dinner, pointless for a Haldi with a snack counter",
          "A song request — worth it for the Sangeet and nowhere else, and it gets a surprisingly high response rate because it is the one question that is fun to answer",
          "A note for the couple — costs nothing, and gets you the we are flying in on the 12th details you would otherwise learn by phone",
          "Accommodation — only if you are actually holding a room block, in which case ask early, because it sets the block size",
        ],
      },
      { type: "h", text: "Leave out" },
      {
        type: "ul",
        items: [
          "Anything you already know, like a phone number you imported from your own list",
          "Questions you will not act on — asking about dietary needs and then serving one fixed menu is worse than not asking",
          "Arrival times, unless you are arranging transport, because the answers will be wrong",
        ],
      },
      { type: "h", text: "Ask per function, not per wedding" },
      {
        type: "p",
        text: "The most useful thing you can do is stop treating the RSVP as one form. The Sangeet asks about the song. The Reception asks about the meal. The Mehendi asks nothing except whether you are coming and how many. Each function asks only what that function needs, which keeps every individual form short — and short forms get finished.",
      },
    ],
  },
  {
    slug: "printed-invitation-digital-rsvp",
    title: "You can have a printed invitation and a digital RSVP",
    summary:
      "The choice people think they are making — traditional card or online invite — is not really a choice. The card and the reply are two different jobs.",
    date: "2026-05-28",
    body: [
      {
        type: "p",
        text: "Families argue about this. One side wants the card: heavy stock, foil, a box, hand-delivered to the people who matter. The other side has watched a cousin spend three weeks collecting replies by phone and wants none of it.",
      },
      {
        type: "p",
        text: "Both are right, because they are talking about different things. The card is how you invite someone. The RSVP is how they answer. Nothing requires those to share a medium, and they never really did — the traditional card came with a phone number printed on it, which is to say, a different channel for the reply.",
      },
      { type: "h", text: "Let each do its job" },
      {
        type: "p",
        text: "The card carries the weight. It is the object that goes on a mantelpiece, that signals how serious this is, that gets hand-delivered to the people whose respect matters. Print it, foil it, deliver it.",
      },
      {
        type: "p",
        text: "The reply only needs to be effortless and countable. A link, a tap, three questions, done — and it lands in your count without anybody writing anything down.",
      },
      { type: "h", text: "The practical version" },
      {
        type: "ul",
        items: [
          "Design one card and use it in both places, so the printed piece and the digital one are unmistakably the same wedding",
          "Hand-deliver the printed card to the people for whom that matters, and send the same design digitally to everyone else",
          "Put the reply link on both — as a line of text on the card, and as a tap in the message",
          "Keep the count in one place regardless of which route the person came through",
        ],
      },
      {
        type: "p",
        text: "This quietly solves the cost problem too. Printing 400 cards is expensive, and most of them go to people who would have been perfectly happy receiving it on their phone. Print the eighty that need to be objects. Send the rest.",
      },
      {
        type: "quote",
        text: "Nobody has ever been offended by a beautiful invitation that arrived on their phone. They are offended by not being invited.",
      },
    ],
  },
];

export const postsNewestFirst = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export function getPost(slug: string | undefined) {
  return posts.find((post) => post.slug === slug);
}

/** Rough reading time, computed so it can never drift from the text. */
export function readingMinutes(post: Post) {
  const words = post.body
    .map((block) => (block.type === "ul" ? block.items.join(" ") : block.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
