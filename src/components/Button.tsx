import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme, type ColorTokens } from '@/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  /** Shown before the title, e.g. an `Icon`. */
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

function getVariantColors(colors: ColorTokens, variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return {
        background: colors.primary,
        foreground: colors.onPrimary,
        border: colors.primary,
      };
    case 'secondary':
      return {
        background: colors.surface,
        foreground: colors.text,
        border: colors.border,
      };
    case 'ghost':
      return {
        background: 'transparent',
        foreground: colors.primary,
        border: 'transparent',
      };
    case 'danger':
      return {
        background: colors.danger,
        foreground: colors.onDanger,
        border: colors.danger,
      };
  }
}

export function Button({
  title,
  icon,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const isDisabled = !!disabled || loading;
  const { background, foreground, border } = getVariantColors(colors, variant);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        { backgroundColor: background, borderColor: border },
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <>
          {icon}
          <Text
            variant={size === 'sm' ? 'caption' : 'label'}
            style={[styles.label, { color: foreground }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ spacing, radii }) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.md,
  },
  sm: { minHeight: 36, paddingHorizontal: spacing.md },
  md: { minHeight: 44, paddingHorizontal: spacing.lg },
  lg: { minHeight: 52, paddingHorizontal: spacing.xl },
  label: { fontWeight: '600' },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
}));
