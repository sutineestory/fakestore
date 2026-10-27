import { Button } from '@/components';
import { useTranslation } from '@/i18n';
import { useFavorite } from '../hooks/useFavorite';

type FavoriteButtonProps = {
  id: string;
};

export function FavoriteButton({ id }: FavoriteButtonProps) {
  const t = useTranslation();
  const { isFavorite, toggle } = useFavorite(id);

  return (
    <Button
      title={isFavorite ? t.favorites.remove : t.favorites.add}
      variant="secondary"
      onPress={toggle}
    />
  );
}
