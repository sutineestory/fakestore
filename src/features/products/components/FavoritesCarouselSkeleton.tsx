import { Card, Skeleton, Stack } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { useFavoriteCardLayout } from '../hooks/useFavoriteCardLayout';
import { CARD_IMAGE_HEIGHT } from '../layout';

// Enough to run off the edge, like the real row.
const CARDS = 3;

type FavoritesCarouselSkeletonProps = {
  /** Read out instead of the placeholder cards. */
  label: string;
};

/** Placeholder favorite cards, sized like the carousel's. */
export function FavoritesCarouselSkeleton({
  label,
}: FavoritesCarouselSkeletonProps) {
  const { typography } = useTheme();
  const styles = useStyles();
  const { cardWidth } = useFavoriteCardLayout();

  return (
    <Stack
      direction="row"
      gap="md"
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      {Array.from({ length: CARDS }, (_, index) => (
        <Card key={index} style={[styles.card, { width: cardWidth }]}>
          <Skeleton height={CARD_IMAGE_HEIGHT} radius="none" />
          <Stack gap="xxs" style={styles.details}>
            <Skeleton width="80%" height={typography.caption.lineHeight} />
            <Skeleton
              width="45%"
              height={typography.label.lineHeight}
              style={styles.price}
            />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  row: { overflow: 'hidden' },
  card: { padding: 0, overflow: 'hidden' },
  details: { padding: spacing.sm },
  price: { alignSelf: 'flex-end' },
}));
