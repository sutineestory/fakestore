import {
  RefreshControl as RNRefreshControl,
  type RefreshControlProps,
} from 'react-native';

import { useTheme } from '@/theme';

/**
 * Pull-to-refresh spinner in theme colors. Every prop is passed through:
 * Android's ScrollView clones this element with its own `style` and renders
 * the scroll content as its `children`.
 */
export function RefreshControl(props: RefreshControlProps) {
  const { colors } = useTheme();

  return (
    <RNRefreshControl
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.surface}
      {...props}
    />
  );
}
