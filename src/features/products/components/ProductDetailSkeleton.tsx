import { Skeleton, Stack } from '@/components';
import { useTheme } from '@/theme';
import { DETAIL_IMAGE_HEIGHT } from '../layout';

const CHIP_WIDTH = 96;
const DESCRIPTION_LINES = ['100%', '100%', '95%', '60%'] as const;

type ProductDetailSkeletonProps = {
  /** Read out instead of the placeholder blocks. */
  label: string;
};

/** Stand-in for the detail screen's content while the product loads. */
export function ProductDetailSkeleton({ label }: ProductDetailSkeletonProps) {
  const { spacing, typography } = useTheme();

  return (
    <Stack
      gap="xl"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <Skeleton height={DETAIL_IMAGE_HEIGHT} radius="lg" />
      <Stack gap="sm">
        <Skeleton
          width={CHIP_WIDTH}
          height={typography.caption.lineHeight + spacing.xs * 2}
          radius="full"
        />
        <Skeleton width="90%" height={typography.heading.lineHeight} />
        <Skeleton width="65%" height={typography.heading.lineHeight} />
        <Stack direction="row" justify="space-between">
          <Skeleton width="45%" height={typography.caption.lineHeight} />
          <Skeleton width="25%" height={typography.heading.lineHeight} />
        </Stack>
      </Stack>
      <Stack gap="xs">
        {DESCRIPTION_LINES.map((width, index) => (
          <Skeleton
            key={index}
            width={width}
            height={typography.body.lineHeight}
          />
        ))}
      </Stack>
    </Stack>
  );
}
