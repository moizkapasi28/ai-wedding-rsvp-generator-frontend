/**
 * Each wedding gets a stable identity colour derived from its id, so the same
 * wedding looks the same in the sidebar switcher and on the All Weddings card.
 * Lives here rather than in a component so both can import it (a component
 * file may only export components — react-refresh/only-export-components).
 */
const GRADIENTS = [
  "from-pink-500 via-rose-500 to-red-500",
  "from-purple-500 to-indigo-500",
  "from-teal-400 to-emerald-600",
  "from-amber-400 to-orange-600",
  "from-blue-400 to-cyan-600",
];

export const getWeddingColor = (id: string) => {
  if (!id) return GRADIENTS[0];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

export const getInitials = (bride: string, groom: string) =>
  `${bride?.charAt(0) || ""}${groom?.charAt(0) || ""}`.toUpperCase() || "W";
