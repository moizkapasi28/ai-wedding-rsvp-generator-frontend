import assert from "node:assert/strict";
import { test } from "node:test";
import { pageRange } from "./pageRange.ts";

test("up to seven pages are all shown", () => {
  assert.deepEqual(pageRange(1, 0), []);
  assert.deepEqual(pageRange(1, 1), [1]);
  assert.deepEqual(pageRange(3, 7), [1, 2, 3, 4, 5, 6, 7]);
});

test("a gap at the end when on the first pages", () => {
  assert.deepEqual(pageRange(1, 10), [1, 2, "gap", 10]);
  assert.deepEqual(pageRange(3, 10), [1, 2, 3, 4, "gap", 10]);
});

test("gaps at both ends in the middle", () => {
  assert.deepEqual(pageRange(5, 10), [1, "gap", 4, 5, 6, "gap", 10]);
});

test("a gap at the start when on the last pages", () => {
  assert.deepEqual(pageRange(10, 10), [1, "gap", 9, 10]);
  assert.deepEqual(pageRange(8, 10), [1, "gap", 7, 8, 9, 10]);
});
