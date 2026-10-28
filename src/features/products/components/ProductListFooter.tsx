import { RequestStatus } from '@/components';
import { useTranslation } from '@/i18n';

type ProductListFooterProps = {
  loadingMore: boolean;
  loadMoreFailed: boolean;
  onRetry: () => void;
};

/** Below the last row: the shared loading state while the next page loads, or its error. */
export function ProductListFooter({
  loadingMore,
  loadMoreFailed,
  onRetry,
}: ProductListFooterProps) {
  const t = useTranslation();

  if (!loadingMore && !loadMoreFailed) {
    return null;
  }

  return (
    <RequestStatus
      status={loadingMore ? 'loading' : 'error'}
      loadingLabel={t.productList.loading}
      errorMessage={t.productList.loadMoreError}
      retryLabel={t.common.retry}
      // Never shown: the footer only renders while loading or failed.
      emptyMessage=""
      onRetry={onRetry}
    />
  );
}
