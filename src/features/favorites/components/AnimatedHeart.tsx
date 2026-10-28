import { HeartIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Animated } from 'react-native';

import { Icon } from '@/components';
import { useTheme } from '@/theme';

type AnimatedHeartProps = {
  filled: boolean;
  scale: Animated.Value;
};

/** Heart outline that fills in for favorites, scaled by `scale`. */
export function AnimatedHeart({ filled, scale }: AnimatedHeartProps) {
  const { colors } = useTheme();
  const style = useMemo(() => ({ transform: [{ scale }] }), [scale]);

  return (
    <Animated.View style={style}>
      <Icon
        icon={HeartIcon}
        color="favorite"
        fill={filled ? colors.favorite : 'none'}
      />
    </Animated.View>
  );
}
