import { useEffect, useState } from 'react';
import {
  Animated,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { makeStyles, useTheme, type Radius } from '@/theme';

const DIMMED = 0.4;
const PULSE_MS = 800;

export type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: Radius;
  style?: StyleProp<ViewStyle>;
};

/**
 * Placeholder block that pulses while content loads. Hidden from screen
 * readers: label the area that holds the skeletons instead.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 'sm',
  style,
}: SkeletonProps) {
  const { radii } = useTheme();
  const styles = useStyles();
  const opacity = usePulse();

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.block,
        { width, height, borderRadius: radii[radius], opacity },
        style,
      ]}
    />
  );
}

function usePulse() {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: DIMMED,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return opacity;
}

const useStyles = makeStyles(({ colors }) => ({
  block: { backgroundColor: colors.surfaceMuted },
}));
