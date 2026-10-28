import { View } from 'react-native';

import { makeStyles } from '@/theme';
import { Text } from './Text';

export type ChipProps = {
  label: string;
};

/** Small pill for a tag or category, title-cased. Not pressable. */
export function Chip({ label }: ChipProps) {
  const styles = useStyles();

  return (
    <View style={styles.chip}>
      <Text variant="caption" color="primary" style={styles.label}>
        {label}
      </Text>
    </View>
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
  label: { textTransform: 'capitalize' },
}));
