import { useMemo } from 'react';
import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import type { Theme } from './themes';
import { useTheme } from './ThemeProvider';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Creates a hook returning theme-aware styles, memoized per theme.
 *
 * @example
 * const useStyles = makeStyles(theme => ({
 *   container: { backgroundColor: theme.colors.surface },
 * }));
 */
export function makeStyles<T extends NamedStyles<T>>(
  factory: (theme: Theme) => T,
) {
  return function useStyles(): T {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
