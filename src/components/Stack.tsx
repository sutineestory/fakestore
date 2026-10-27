import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme, type Spacing } from '@/theme';

export type StackProps = ViewProps & {
  direction?: 'row' | 'column';
  gap?: Spacing;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
};

/** Flex container that spaces its children with a theme spacing token. */
export function Stack({
  direction = 'column',
  gap = 'none',
  align,
  justify,
  wrap = false,
  style,
  ...rest
}: StackProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: spacing[gap],
          alignItems: align,
          justifyContent: justify,
        },
        wrap && styles.wrap,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { flexWrap: 'wrap' },
});
