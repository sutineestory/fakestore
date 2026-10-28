import { View } from 'react-native';

import { makeStyles } from '@/theme';
import { Stack } from './Stack';

export type PageDotsProps = {
  count: number;
  activeIndex: number;
};

/**
 * Position indicator for a carousel. Decorative: screen readers reach every
 * card by swiping, so the dots are hidden from them.
 */
export function PageDots({ count, activeIndex }: PageDotsProps) {
  const styles = useStyles();

  if (count < 2) {
    return null;
  }

  return (
    <Stack
      direction="row"
      gap="xs"
      justify="center"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.active]}
        />
      ))}
    </Stack>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.border,
  },
  active: { width: spacing.lg, backgroundColor: colors.primary },
}));
