export type StarFill = 'full' | 'half' | 'empty';

const STARS = 5;

/** How to draw each of five stars for a 0–5 rating, to the nearest half star. */
export function starFills(rate: number): StarFill[] {
  const halves = Math.round(Math.min(Math.max(rate, 0), STARS) * 2);
  return Array.from({ length: STARS }, (_, index) => {
    const left = halves - index * 2;
    return left >= 2 ? 'full' : left === 1 ? 'half' : 'empty';
  });
}
