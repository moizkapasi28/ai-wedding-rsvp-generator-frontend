/**
 * Which page numbers a pager should show: first, last, and the current page
 * with a neighbour either side. Gaps collapse to a "gap" marker.
 *
 * TablePagination used to render one button per page, so 400 guests at 10 a
 * page put 40 numbers on the screen.
 *
 * Import-free on purpose, like lib/sse.ts, so it can be checked on its own.
 */
export const pageRange = (
  page: number,
  totalPages: number,
): (number | "gap")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const shown = new Set([1, totalPages, page, page - 1, page + 1]);
  const pages = [...shown]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  return pages.flatMap((p, i) =>
    i > 0 && p - pages[i - 1] > 1 ? (["gap", p] as (number | "gap")[]) : [p],
  );
};
