import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSseChunk } from "./sse.ts";

test("a complete message is returned and nothing is left over", () => {
  assert.deepEqual(parseSseChunk('event: rsvp\ndata: {"a":1}\n\n'), {
    events: [{ event: "rsvp", data: '{"a":1}' }],
    rest: "",
  });
});

test("a message split across two chunks waits for its end", () => {
  const first = parseSseChunk("event: rsvp\ndata: hel");
  assert.deepEqual(first.events, []);
  assert.equal(first.rest, "event: rsvp\ndata: hel");

  const second = parseSseChunk(first.rest + "lo\n\n");
  assert.deepEqual(second, {
    events: [{ event: "rsvp", data: "hello" }],
    rest: "",
  });
});

test("several messages in one chunk, with an unfinished one kept as rest", () => {
  const { events, rest } = parseSseChunk(
    "event: rsvp\ndata: 1\n\nevent: rsvp\ndata: 2\n\nevent: rs",
  );
  assert.deepEqual(
    events.map((e) => e.data),
    ["1", "2"],
  );
  assert.equal(rest, "event: rs");
});

test("CRLF line endings are handled", () => {
  assert.deepEqual(parseSseChunk("event: rsvp\r\ndata: x\r\n\r\n").events, [
    { event: "rsvp", data: "x" },
  ]);
});

test("heartbeat comments carry no message", () => {
  assert.deepEqual(parseSseChunk(": ping\n\n"), { events: [], rest: "" });
});

test("a message without an event name is a plain message, and data lines join", () => {
  assert.deepEqual(parseSseChunk("data: a\ndata: b\n\n").events, [
    { event: "message", data: "a\nb" },
  ]);
});
