/**
 * How long to wait before asking for an invite card generation's status again.
 *
 * Most runs finish inside half a minute, so they are polled quickly; one that
 * is still going after that (two image stages, retries with backoff) can take
 * minutes, and polling it every 3s for that long eats the API's per-IP rate
 * limit for everyone on the same connection. A rate-limited poll waits out
 * the limiter's Retry-After instead of asking again straight away.
 *
 * Import-free on purpose, like lib/sse.ts, so it can be checked on its own.
 */
export const generationPollDelay = (
  startedAt: string | null | undefined,
  now: number,
  // Seconds from the 429's Retry-After header; undefined when the last poll wasn't rate limited
  retryAfterSeconds?: number,
): number => {
  if (retryAfterSeconds !== undefined) return (retryAfterSeconds + 1) * 1000;

  // No start time yet (still queued) or an unparseable one counts as just started
  const elapsed = startedAt ? now - Date.parse(startedAt) : 0;
  return elapsed > 30_000 ? 10_000 : 3_000;
};
