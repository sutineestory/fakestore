import { StyleSheet } from 'react-native';

import { Button } from './Button';
import { Stack } from './Stack';

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Row of equal-width buttons for picking one of a few options. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <Stack direction="row" gap="sm">
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            title={option.label}
            size="sm"
            variant={selected ? 'primary' : 'secondary'}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={styles.segment}
          />
        );
      })}
    </Stack>
  );
}

const styles = StyleSheet.create({
  segment: { flex: 1 },
});
