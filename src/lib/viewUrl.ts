/**
 * How long a signed S3 view URL can be reused, counted from when it was fetched.
 *
 * The API says when each URL stops working (`expires_at`). The cached copy is
 * dropped a minute before that, or halfway through for a URL that lives two
 * minutes or less, so nothing renders a link that is about to 403. An API
 * response without `expires_at` falls back to the old fixed five minutes.
 *
 * Import-free on purpose, like lib/sse.ts, so it can be checked on its own.
 */
// ponytail: compares the server's expires_at with this device's clock, so it relies on the
// two agreeing to within that margin; have the API return a lifetime in seconds if skew bites
export const viewUrlFreshMs = (
  expiresAt: string | null | undefined,
  fetchedAt: number,
): number => {
  const life = expiresAt ? Date.parse(expiresAt) - fetchedAt : NaN;
  if (!Number.isFinite(life)) return 5 * 60_000;

  return Math.max(0, life - Math.min(60_000, life / 2));
};
