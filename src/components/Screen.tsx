import type { PropsWithChildren, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { makeStyles } from '@/theme';

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

  return (
    <SafeAreaView edges={edges} style={[styles.container, style]}>
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
      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
