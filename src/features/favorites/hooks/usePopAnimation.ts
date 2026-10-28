import { useCallback, useState } from 'react';
import { Animated } from 'react-native';

const POP_FROM = 0.6;

/** A scale that shrinks and springs back past full size each time `pop` runs. */
export function usePopAnimation() {
  const [scale] = useState(() => new Animated.Value(1));

  const pop = useCallback(() => {
    scale.setValue(POP_FROM);
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, pop };
}
