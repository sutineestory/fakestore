import { Stack } from '@/components';
import { ProductListItemSkeleton } from './ProductListItemSkeleton';

type ProductListSkeletonProps = {
  count: number;
  /** Read out instead of the placeholder rows, e.g. "Loading products". */
  label: string;
};

/** `count` placeholder rows, spaced like the list they stand in for. */
export function ProductListSkeleton({
  count,
  label,
}: ProductListSkeletonProps) {
  return (
    <Stack
      gap="md"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductListItemSkeleton key={index} />
      ))}
    </Stack>
  );
}
