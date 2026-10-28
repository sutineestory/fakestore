import { View } from 'react-native';

import { RequestStatus } from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles } from '@/theme';
import { ProductListSkeleton } from './ProductListSkeleton';

const LOADING_ROWS = 2;

type ProductListFooterProps = {
  loadingMore: boolean;
  loadMoreFailed: boolean;
  onRetry: () => void;
};

/** Below the last row: placeholder rows while the next page loads, or its error. */
export function ProductListFooter({
  loadingMore,
  loadMoreFailed,
  onRetry,
}: ProductListFooterProps) {
  const t = useTranslation();
  const styles = useStyles();

  if (loadingMore) {
    return (
      <View style={styles.more}>
        <ProductListSkeleton
          count={LOADING_ROWS}
          label={t.productList.loading}
        />
      </View>
    );
  }
  if (!loadMoreFailed) {
    return null;
  }
  return (
    <RequestStatus
      status="error"
      loadingLabel={t.productList.loading}
      errorMessage={t.productList.loadMoreError}
      retryLabel={t.common.retry}
      // Never shown: this only renders the error state.
      emptyMessage=""
      onRetry={onRetry}
    />
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  // Matches the gap between rows above it.
  more: { paddingTop: spacing.md },
}));
