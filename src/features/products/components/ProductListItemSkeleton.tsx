import { Card, Skeleton, Stack } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { ROW_IMAGE_WIDTH } from '../layout';

/** Stand-in for a `ProductListItem` while products load; same shape and size. */
export function ProductListItemSkeleton() {
  const { typography } = useTheme();
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      <Stack direction="row">
        <Skeleton
          width={ROW_IMAGE_WIDTH}
          height={ROW_IMAGE_WIDTH}
          radius="none"
        />
        <Stack gap="sm" style={styles.content}>
          <Skeleton width="90%" height={typography.subheading.lineHeight} />
          <Skeleton width="60%" height={typography.subheading.lineHeight} />
          <Stack direction="row" justify="space-between">
            <Skeleton width="35%" height={typography.caption.lineHeight} />
            <Skeleton width="20%" height={typography.label.lineHeight} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  card: { padding: 0, overflow: 'hidden' },
  content: { flex: 1, padding: spacing.md },
}));
