import type { Event } from "@/models/event.model";
import type { Guest, GuestEventInvite } from "@/models/guest.model";
import type { EventWithInvitesAndWedding } from "@/models/pageSetting.model";
import type { LiveRsvp, Wedding, WeddingDashboard } from "@/models/wedding.model";

/**
 * One made-up wedding for the landing and auth pages to render through the
 * app's real components, so the site shows exactly what the portal and the
 * guest RSVP page look like. Dates are relative to page load so the countdown
 * and "x minutes ago" always read as a wedding that's coming up.
 */

// ponytail: frozen at module load, so a tab left open for days drifts; fine for a marketing page
const NOW = Date.now();
const DAY = 86_400_000;
const MINUTE = 60_000;

export const SAMPLE_NOW = NOW;

const daysFromNow = (days: number) => new Date(NOW + days * DAY).toISOString();

export const sampleWedding = {
  id: "sample-wedding",
  title: "Ananya & Rohan",
  slug: "ananya-rohan",
  bride_name: "Ananya",
  groom_name: "Rohan",
  date: daysFromNow(23),
  venue: "Jagmandir Island Palace",
  city: "Udaipur",
} as Wedding;

// Same maths as the backend's event stats (event.service.ts)
const stats = (total: number, attending: number, maybe: number, declined: number) => {
  const pending = total - attending - maybe - declined;
  const pct = (n: number) => Math.round((n / total) * 100);
  return {
    totalGuests: total,
    attendingGuests: attending,
    maybeGuests: maybe,
    declinedGuests: declined,
    pendingGuests: pending,
    completion: pct(attending + maybe + declined),
    progressBar: {
      confirmed: pct(attending),
      maybe: pct(maybe),
      declined: pct(declined),
      pending: pct(pending),
    },
  };
};

const event = (
  id: string,
  title: string,
  days: number,
  time: string,
  venue: string,
  event_side: Event["event_side"],
  eventStats: Event["stats"],
) =>
  ({
    id,
    wedding_id: sampleWedding.id,
    title,
    date: daysFromNow(days),
    time,
    venue,
    address: "Lake Pichola, Udaipur",
    city: "Udaipur",
    event_side,
    stats: eventStats,
  }) as Event;

export const sampleEvents: Event[] = [
  event("mehendi", "Mehendi", 21, "11:00 AM", "Bagore Ki Haveli", "BRIDE", stats(120, 78, 8, 12)),
  event("haldi", "Haldi", 22, "9:30 AM", "Taj Lake Palace lawns", "BOTH", stats(140, 96, 11, 9)),
  event("sangeet", "Sangeet", 22, "7:00 PM", "Jagmandir Island Palace", "BOTH", stats(260, 210, 14, 18)),
  event("reception", "Reception", 23, "7:30 PM", "The Oberoi Udaivilas", "BOTH", stats(340, 288, 17, 11)),
];

// The shape Page Settings' live preview takes; the preview only reads these fields
export const sampleRsvpEvent = {
  title: "Sangeet",
  date: daysFromNow(22),
  time: "7:00 PM",
  venue: "Jagmandir Island Palace",
  city: "Udaipur",
  event_side: "BOTH",
  description: "An evening of music and dancing with both families before the big day.",
  wedding: { bride_name: "Ananya", groom_name: "Rohan" },
} as EventWithInvitesAndWedding;

export const sampleDashboardStats: WeddingDashboard["stats"] = {
  totalGuests: 412,
  guestsThisWeek: 18,
  attending: 288,
  confirmationRate: 70,
  pending: 94,
  responsesThisWeek: 31,
  accommodationRequired: 46,
};

const reply = (
  guestName: string,
  eventTitle: string,
  status: LiveRsvp["status"],
  minutesAgo: number,
): LiveRsvp => ({
  inviteId: `${guestName}-${eventTitle}`,
  guestName,
  eventTitle,
  status,
  plusOnes: null,
  respondedAt: new Date(NOW - minutesAgo * MINUTE).toISOString(),
});

export const sampleRecentRsvps: LiveRsvp[] = [
  reply("Meera Iyer", "Sangeet", "ATTENDING", 0),
  reply("Ishaan Kapoor", "Reception", "ATTENDING", 12),
  reply("Farah Sheikh", "Sangeet", "MAYBE", 47),
  reply("Vikram Iyer", "Mehendi", "DECLINED", 180),
  reply("Priya Nair", "Haldi", "ATTENDING", 26 * 60),
  reply("Kavya Rao", "Reception", "ATTENDING", 3 * DAY / MINUTE),
];

const invite = (eventTitle: string, status: string, sent = true) =>
  ({
    id: eventTitle, // unique within a guest, which is all the badge keys need
    status,
    invite_sent_at: sent ? daysFromNow(-5) : null,
    event: { title: eventTitle },
  }) as GuestEventInvite;

const guest = (
  id: string,
  name: string,
  mobile_number: string,
  side: Guest["side"],
  group: Guest["group"],
  invites: GuestEventInvite[],
) =>
  ({
    id,
    name,
    // example.com is reserved for documentation, so these can never reach anyone
    email: `${name.split(" ")[0].toLowerCase()}@example.com`,
    mobile_number,
    side,
    group,
    guestEventInvite: invites,
  }) as Guest;

export const sampleGuests: Guest[] = [
  guest("g1", "Meera Iyer", "+91 98200 00101", "BRIDE", "FAMILY", [
    invite("Mehendi", "ATTENDING"),
    invite("Sangeet", "ATTENDING"),
    invite("Reception", "ATTENDING"),
  ]),
  guest("g2", "Aarav Shah", "+91 98200 00102", "GROOM", "FRIEND", [
    invite("Sangeet", "MAYBE"),
    invite("Reception", "ATTENDING"),
  ]),
  guest("g3", "Priya Nair", "+91 98200 00103", "BRIDE", "RELATIVE", [
    invite("Haldi", "ATTENDING"),
    invite("Sangeet", "PENDING"),
  ]),
  guest("g4", "Dev Menon", "+91 98200 00104", "GROOM", "COLLEAGUE", [
    invite("Reception", "PENDING", false),
  ]),
  guest("g5", "Kavya Rao", "+91 98200 00105", "BOTH", "VIP", [
    invite("Sangeet", "ATTENDING"),
    invite("Reception", "DECLINED"),
  ]),
];
