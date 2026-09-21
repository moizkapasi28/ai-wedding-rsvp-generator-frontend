/**
 * One RSVP status vocabulary for the whole app: the same four colours mean the
 * same four things on the dashboard bar, in the live replies feed and in the
 * guest list. Lives here rather than in a component so all three can import it.
 */
export type RsvpStatus = "ATTENDING" | "MAYBE" | "DECLINED" | "PENDING";

const STATUS: Record<RsvpStatus, { label: string; className: string; dot: string }> = {
  ATTENDING: {
    label: "Attending",
    className:
      "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
  MAYBE: {
    label: "Maybe",
    className:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  DECLINED: {
    label: "Declined",
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  PENDING: {
    label: "Pending",
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400",
    dot: "bg-violet-500",
  },
};

/** Anything the API hasn't replied to yet counts as pending. */
export const rsvpStatus = (status?: string | null) =>
  STATUS[(status ?? "").toUpperCase() as RsvpStatus] ?? STATUS.PENDING;

export const RSVP_LEGEND = (
  ["ATTENDING", "MAYBE", "DECLINED", "PENDING"] as const
).map((key) => ({ label: STATUS[key].label, dot: STATUS[key].dot }));
