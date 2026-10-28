import type { PropsWithChildren, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from 'react-native-safe-area-context';

import { makeStyles, useTheme } from '@/theme';

export type ScreenProps = PropsWithChildren<{
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Apply the default screen padding. */
  padded?: boolean;
  /**
   * Safe-area edges to inset. Defaults to left/right because navigator
   * headers and tab bars already handle top/bottom.
   */
  edges?: Edge[];
  /** Pinned below the content, e.g. a bar of actions; the content scrolls above it. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

const DEFAULT_EDGES: Edge[] = ['left', 'right'];

/** Root container for every screen: themed background, safe area, padding. */
export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = DEFAULT_EDGES,
  footer,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const styles = useStyles();
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();
  // A footer takes over the bottom inset, so its own color reaches the edge
  // instead of a strip of screen background showing beneath it.
  const footerOwnsBottom = !!footer && edges.includes('bottom');
  const safeEdges = footerOwnsBottom
    ? edges.filter(edge => edge !== 'bottom')
    : edges;

  return (
    <SafeAreaView edges={safeEdges} style={[styles.container, style]}>
      {scroll ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            padded && styles.padded,
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.container,
            padded && styles.padded,
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
      {footer ? (
        <View
          style={[
            styles.footer,
            footerOwnsBottom && { paddingBottom: spacing.lg + insets.bottom },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    padding: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
}));
