type ScrollMetrics = {
  contentOffset: { x: number };
  layoutMeasurement: { width: number };
  contentSize: { width: number };
};

/**
 * The card a horizontal, snapping carousel has settled on. When several cards
 * fit on screen the last few can never snap to the left edge, so reaching the
 * end counts as showing the last card.
 */
export function carouselIndex(
  { contentOffset, layoutMeasurement, contentSize }: ScrollMetrics,
  interval: number,
  count: number,
): number {
  const last = Math.max(count - 1, 0);
  // Allow a pixel of rounding in the reported sizes.
  if (contentOffset.x + layoutMeasurement.width >= contentSize.width - 1) {
    return last;
  }
  return Math.min(Math.max(Math.round(contentOffset.x / interval), 0), last);
}
