import { Pressable, View } from 'react-native';

import { makeStyles } from '@/theme';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  /** Makes the chip a toggle, e.g. one option of a filter. */
  onPress?: () => void;
  /** Whether a toggle chip is on; fills it in. */
  selected?: boolean;
};

/**
 * Small pill for a tag or category, title-cased. Not pressable unless given
 * `onPress`, which turns it into an outlined toggle.
 */
export function Chip({ label, onPress, selected = false }: ChipProps) {
  const styles = useStyles();

  if (!onPress) {
    return (
      <View style={styles.chip}>
        <Text variant="caption" color="primary" style={styles.label}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        styles.toggle,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text
        variant="caption"
        color={selected ? 'onPrimary' : 'text'}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.primaryMuted,
  },
  // Taller than a tag so it is comfortable to tap.
  toggle: {
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primary },
  label: { textTransform: 'capitalize' },
  pressed: { opacity: 0.8 },
}));
