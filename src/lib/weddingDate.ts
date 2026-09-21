// Wedding dates arrive as calendar dates ("2026-02-14"), which parse to UTC
// midnight. Comparing those against local date parts drifts by a day in
// negative UTC offsets, so both sides are reduced to a UTC day number first.
const toDayNumber = (y: number, m: number, d: number) => Date.UTC(y, m, d) / 86400000;

const parse = (date?: string | null) => {
  if (!date) return null;
  const when = new Date(date);
  return Number.isNaN(when.getTime()) ? null : when;
};

/** Whole days from today to the wedding. Negative once it has passed. */
export const daysUntilWedding = (date?: string | null) => {
  const when = parse(date);
  if (!when) return null;
  const now = new Date();
  return (
    toDayNumber(when.getUTCFullYear(), when.getUTCMonth(), when.getUTCDate()) -
    toDayNumber(now.getFullYear(), now.getMonth(), now.getDate())
  );
};

/** Just the day, e.g. "28 Oct" — the year only when it isn't this one. */
export const formatWeddingDay = (date?: string | null) => {
  const when = parse(date);
  if (!when) return "Date not set";
  // Year is noise for this year's wedding and essential for any other, so it
  // only appears when it differs.
  const sameYear = when.getUTCFullYear() === new Date().getFullYear();
  return when.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone: "UTC",
  });
};

export const formatWeddingDate = (date?: string | null) => {
  const days = daysUntilWedding(date);
  if (days === null) return "Date not set";

  const day = formatWeddingDay(date);
  if (days === 0) return `${day}, today`;
  if (days === 1) return `${day}, tomorrow`;
  if (days > 1) return `${day}, in ${days} days`;
  return day;
};
