import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { daysUntilWedding, formatWeddingDate } from "./weddingDate.ts";

// "Today" is pinned to local noon on 10 Oct 2026, so the result is the same in any timezone
const pinToday = (t: TestContext) =>
  t.mock.timers.enable({
    apis: ["Date"],
    now: new Date(2026, 9, 10, 12).getTime(),
  });

test("whole days from today to the wedding", (t) => {
  pinToday(t);
  assert.equal(daysUntilWedding("2026-10-10"), 0);
  assert.equal(daysUntilWedding("2026-10-11"), 1);
  assert.equal(daysUntilWedding("2026-10-20"), 10);
  assert.equal(daysUntilWedding("2026-10-01"), -9);
  assert.equal(daysUntilWedding("2027-03-28"), 169);
});

test("no date, or one that does not parse, is null", () => {
  assert.equal(daysUntilWedding(null), null);
  assert.equal(daysUntilWedding("not a date"), null);
});

test("the label names today and tomorrow, counts the days ahead, and shows the year only when it differs", (t) => {
  pinToday(t);
  assert.equal(formatWeddingDate("2026-10-10"), "10 Oct, today");
  assert.equal(formatWeddingDate("2026-10-11"), "11 Oct, tomorrow");
  assert.equal(formatWeddingDate("2026-10-20"), "20 Oct, in 10 days");
  assert.equal(formatWeddingDate("2026-10-01"), "1 Oct");
  assert.equal(formatWeddingDate("2027-03-28"), "28 Mar 2027, in 169 days");
  assert.equal(formatWeddingDate(undefined), "Date not set");
});
