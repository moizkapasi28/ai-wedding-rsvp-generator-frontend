/**
 * Whose side a ceremony or guest belongs to. Lives here rather than in
 * EventCard so the eight places that need it can import it without pulling in a
 * component (a component file may only export components —
 * react-refresh/only-export-components).
 */
export const getSideBadgeStyles = (side: string) => {
  switch (side) {
    case "BRIDE":
      return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/50";
    case "GROOM":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/50";
    case "BOTH":
    default:
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50";
  }
};

/**
 * The same three hues filled in, for a control that is both a side and a
 * selection: hue says whose side it is, fill says whether it's the one you're
 * editing. Pairs with getSideBadgeStyles, which is the unfilled state.
 */
export const getSideSelectedStyles = (side: string) => {
  switch (side) {
    case "BRIDE":
      return "bg-pink-600 text-white border-pink-600 hover:bg-pink-600 hover:text-white dark:bg-pink-500 dark:border-pink-500";
    case "GROOM":
      return "bg-sky-600 text-white border-sky-600 hover:bg-sky-600 hover:text-white dark:bg-sky-500 dark:border-sky-500";
    case "BOTH":
    default:
      return "bg-purple-600 text-white border-purple-600 hover:bg-purple-600 hover:text-white dark:bg-purple-500 dark:border-purple-500";
  }
};

export const formatSide = (side: string) => {
  if (side === "BOTH") return "Bride & Groom";
  return side.charAt(0) + side.slice(1).toLowerCase();
};
