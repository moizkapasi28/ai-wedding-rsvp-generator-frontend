import assert from "node:assert/strict";
import { test } from "node:test";
import { formatSide } from "./eventSide.ts";
import { rsvpStatus } from "./rsvpStatus.ts";

test("an RSVP status is matched in any case; anything unknown counts as pending", () => {
  assert.equal(rsvpStatus("ATTENDING").label, "Attending");
  assert.equal(rsvpStatus("declined").label, "Declined");
  assert.equal(rsvpStatus(null).label, "Pending");
  assert.equal(rsvpStatus("something else").label, "Pending");
});

test("a side reads as a name", () => {
  assert.equal(formatSide("BOTH"), "Bride & Groom");
  assert.equal(formatSide("BRIDE"), "Bride");
  assert.equal(formatSide("GROOM"), "Groom");
});
