import { HeartIcon } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { Animated } from 'react-native';

import { Button, Icon } from '@/components';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';
import { useFavorite } from '../hooks/useFavorite';
import { usePopAnimation } from '../hooks/usePopAnimation';

type FavoriteButtonProps = {
  id: string;
};

export function FavoriteButton({ id }: FavoriteButtonProps) {
  const t = useTranslation();
  const { colors } = useTheme();
  const { isFavorite, toggle } = useFavorite(id);
  const { scale, pop } = usePopAnimation();
  const heartStyle = useMemo(() => ({ transform: [{ scale }] }), [scale]);

  const onPress = useCallback(() => {
    // Celebrate adding only; removing shouldn't feel like a reward.
    if (!isFavorite) {
      pop();
    }
    toggle();
  }, [isFavorite, pop, toggle]);

  return (
    <Button
      title={isFavorite ? t.favorites.remove : t.favorites.add}
      variant="secondary"
      icon={
        <Animated.View style={heartStyle}>
          <Icon
            icon={HeartIcon}
            color="favorite"
            fill={isFavorite ? colors.favorite : 'none'}
          />
        </Animated.View>
      }
      onPress={onPress}
    />
  );
}
