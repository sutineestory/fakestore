import { Button } from '@/components';
import { useTranslation } from '@/i18n';
import { useAnimatedFavorite } from '../hooks/useAnimatedFavorite';
import { AnimatedHeart } from './AnimatedHeart';

type FavoriteButtonProps = {
  id: string;
};

export function FavoriteButton({ id }: FavoriteButtonProps) {
  const t = useTranslation();
  const { isFavorite, scale, press } = useAnimatedFavorite(id);

  return (
    <Button
      title={isFavorite ? t.favorites.remove : t.favorites.add}
      variant="secondary"
      icon={<AnimatedHeart filled={isFavorite} scale={scale} />}
      onPress={press}
    />
  );
}
