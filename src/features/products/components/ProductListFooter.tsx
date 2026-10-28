import { ActivityIndicator } from 'react-native';

import { Button, Stack, Text } from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';

type ProductListFooterProps = {
  loadingMore: boolean;
  loadMoreFailed: boolean;
  onRetry: () => void;
};

/** Below the last row: a spinner while the next page loads, or its error. */
export function ProductListFooter({
  loadingMore,
  loadMoreFailed,
  onRetry,
}: ProductListFooterProps) {
  const t = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();

  if (loadingMore) {
    return (
      <ActivityIndicator
        accessibilityLabel={t.productList.loading}
        color={colors.primary}
        style={styles.container}
      />
    );
  }
  if (loadMoreFailed) {
    return (
      <Stack gap="sm" align="center" style={styles.container}>
        <Text variant="bodySmall" color="textMuted" align="center">
          {t.productList.loadMoreError}
        </Text>
        <Button
          title={t.common.retry}
          variant="secondary"
          size="sm"
          onPress={onRetry}
        />
      </Stack>
    );
  }
  return null;
}

const useStyles = makeStyles(({ spacing }) => ({
  container: { paddingVertical: spacing.lg },
}));
