// Wedding dates arrive as calendar dates ("2026-02-14"), which parse to UTC
// midnight. Comparing those against local date parts drifts by a day in
// negative UTC offsets, so both sides are reduced to a UTC day number first.
const toDayNumber = (y: number, m: number, d: number) => Date.UTC(y, m, d) / 86400000;

export const formatWeddingDate = (date?: string | null) => {
  if (!date) return "Date not set";
  const when = new Date(date);
  if (Number.isNaN(when.getTime())) return "Date not set";

  const day = when.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

  const now = new Date();
  const days =
    toDayNumber(when.getUTCFullYear(), when.getUTCMonth(), when.getUTCDate()) -
    toDayNumber(now.getFullYear(), now.getMonth(), now.getDate());

  if (days === 0) return `${day}, today`;
  if (days === 1) return `${day}, tomorrow`;
  if (days > 1) return `${day}, in ${days} days`;
  return day;
};
