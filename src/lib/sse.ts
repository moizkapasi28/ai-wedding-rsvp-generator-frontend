export type SseMessage = { event: string; data: string };

// Splits a text/event-stream buffer into complete messages.
// `rest` is the unfinished tail to prepend to the next chunk.
// Kept import-free so `node --test` can run it directly.
export function parseSseChunk(buffer: string): {
  events: SseMessage[];
  rest: string;
} {
  const blocks = buffer.replace(/\r\n/g, "\n").split("\n\n");
  const rest = blocks.pop() ?? "";
  const events: SseMessage[] = [];

  for (const block of blocks) {
    let event = "message";
    const data: string[] = [];

    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
    }

    // Comment-only blocks (heartbeats) carry no data
    if (data.length) events.push({ event, data: data.join("\n") });
  }

  return { events, rest };
}
