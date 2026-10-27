import { ActivityIndicator } from 'react-native';

import { Button, Stack, Text } from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';
import type { SampleItemsState } from '../hooks/useSampleItems';

type SampleListStatusProps = {
  status: SampleItemsState['status'];
  /** Trimmed search text, so an empty result can say what didn't match. */
  query: string;
  onRetry: () => void;
};

/** Fills the list while it has no rows: loading, failed, or nothing found. */
export function SampleListStatus({
  status,
  query,
  onRetry,
}: SampleListStatusProps) {
  const t = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();

  switch (status) {
    case 'loading':
      return (
        <ActivityIndicator
          accessibilityLabel={t.sample.loading}
          color={colors.primary}
          style={styles.container}
        />
      );
    case 'error':
      return (
        <Stack gap="md" align="center" style={styles.container}>
          <Text color="textMuted" align="center">
            {t.sample.error}
          </Text>
          <Button
            title={t.sample.retry}
            variant="secondary"
            onPress={onRetry}
          />
        </Stack>
      );
    case 'success':
      return (
        <Text color="textMuted" align="center" style={styles.container}>
          {query ? t.sample.noResults(query) : t.sample.empty}
        </Text>
      );
  }
}

const useStyles = makeStyles(({ spacing }) => ({
  container: { paddingVertical: spacing.xxl },
}));
