import assert from "node:assert/strict";
import { test } from "node:test";
import { generationPollDelay } from "./generationPolling.ts";

const now = Date.parse("2026-10-05T10:00:00Z");
const ago = (seconds: number) => new Date(now - seconds * 1000).toISOString();

test("a run is polled every 3s for its first 30s, then every 10s", () => {
  assert.equal(generationPollDelay(ago(5), now), 3_000);
  assert.equal(generationPollDelay(ago(30), now), 3_000);
  assert.equal(generationPollDelay(ago(31), now), 10_000);
  assert.equal(generationPollDelay(ago(240), now), 10_000);
});

test("no start time yet, or an unreadable one, counts as just started", () => {
  assert.equal(generationPollDelay(null, now), 3_000);
  assert.equal(generationPollDelay("garbage", now), 3_000);
});

test("a rate-limited poll waits out Retry-After plus a second, whatever the run's age", () => {
  assert.equal(generationPollDelay(ago(240), now, 12), 13_000);
  assert.equal(generationPollDelay(null, now, 0), 1_000);
});

test("a 4-minute run stays under 35 status requests", () => {
  let elapsed = 0;
  let polls = 0;
  while (elapsed < 240_000) {
    elapsed += generationPollDelay(ago(elapsed / 1000), now);
    polls++;
  }
  assert.ok(polls < 35, `${polls} polls`);
});
