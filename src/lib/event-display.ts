export type DisplayEvent = {
  date?: string;
  time?: string;
  venue?: string;
  city?: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  event_side: string;
};

type Couple = { bride_name?: string; groom_name?: string };

export const getEventDisplay = (event: DisplayEvent, wedding?: Couple) => {
  const names =
    event.event_side === "GROOM"
      ? wedding?.groom_name
      : event.event_side === "BRIDE"
        ? wedding?.bride_name
        : [wedding?.bride_name, wedding?.groom_name].filter(Boolean).join(" & ");
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const when = [dateStr, event.time].filter(Boolean).join(" · ");
  const mapQuery =
    event.latitude && event.longitude
      ? `${event.latitude},${event.longitude}`
      : event.address || place;

  return { names, dateStr, place, when, mapQuery };
};
