import { ActivityIndicator } from 'react-native';

import { makeStyles, useTheme } from '@/theme';
import { Button } from './Button';
import { Stack } from './Stack';
import { Text } from './Text';

export type RequestStatusProps = {
  status: 'loading' | 'error' | 'success';
  loadingLabel: string;
  errorMessage: string;
  retryLabel: string;
  /** Shown once the request succeeded but there is nothing to show. */
  emptyMessage: string;
  onRetry: () => void;
};

/** Fills a screen or list while it has no content: loading, failed, or empty. */
export function RequestStatus({
  status,
  loadingLabel,
  errorMessage,
  retryLabel,
  emptyMessage,
  onRetry,
}: RequestStatusProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  switch (status) {
    case 'loading':
      return (
        <ActivityIndicator
          accessibilityLabel={loadingLabel}
          color={colors.primary}
          style={styles.container}
        />
      );
    case 'error':
      return (
        <Stack gap="md" align="center" style={styles.container}>
          <Text color="textMuted" align="center">
            {errorMessage}
          </Text>
          <Button title={retryLabel} variant="secondary" onPress={onRetry} />
        </Stack>
      );
    case 'success':
      return (
        <Text color="textMuted" align="center" style={styles.container}>
          {emptyMessage}
        </Text>
      );
  }
}

const useStyles = makeStyles(({ spacing }) => ({
  container: { paddingVertical: spacing.xxl },
}));
