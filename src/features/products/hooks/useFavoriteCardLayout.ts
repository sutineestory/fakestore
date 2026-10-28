import { useWindowDimensions } from 'react-native';

import { useTheme } from '@/theme';

// Two and a half cards on screen, so the cut-off one hints at scrolling.
const VISIBLE_CARDS = 2.5;

/** Card width and snap interval for the favorites carousel. */
export function useFavoriteCardLayout() {
  const { spacing } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  // The list around the row is inset by `lg` on both sides.
  const cardWidth = Math.round(
    (windowWidth - spacing.lg * 2 - spacing.md * 2) / VISIBLE_CARDS,
  );

  return { cardWidth, interval: cardWidth + spacing.md };
}
