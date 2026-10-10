import assert from "node:assert/strict";
import { test } from "node:test";
import { viewUrlFreshMs } from "./viewUrl.ts";

const fetchedAt = Date.parse("2026-10-06T10:00:00Z");
const expiresIn = (seconds: number) =>
  new Date(fetchedAt + seconds * 1000).toISOString();

test("a signed URL is reused until a minute before it expires", () => {
  assert.equal(viewUrlFreshMs(expiresIn(3600), fetchedAt), 3_540_000);
  assert.equal(viewUrlFreshMs(expiresIn(300), fetchedAt), 240_000);
});

test("a short-lived URL is reused for half its life", () => {
  assert.equal(viewUrlFreshMs(expiresIn(120), fetchedAt), 60_000);
  assert.equal(viewUrlFreshMs(expiresIn(60), fetchedAt), 30_000);
});

test("an expired URL is never fresh", () => {
  assert.equal(viewUrlFreshMs(expiresIn(-5), fetchedAt), 0);
});

test("without an expiry from the API it falls back to five minutes", () => {
  assert.equal(viewUrlFreshMs(undefined, fetchedAt), 300_000);
  assert.equal(viewUrlFreshMs("garbage", fetchedAt), 300_000);
});
