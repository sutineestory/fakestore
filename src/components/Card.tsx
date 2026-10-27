import {
  Pressable,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { makeStyles } from '@/theme';

export type CardProps = Omit<ViewProps, 'style'> & {
  /** When set, the card becomes pressable and announces itself as a button. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({ onPress, style, children, ...rest }: CardProps) {
  const styles = useStyles();

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
}));
