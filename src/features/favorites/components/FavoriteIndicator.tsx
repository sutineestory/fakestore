import { StarIcon } from 'lucide-react-native';

import { Icon } from '@/components';
import { useTranslation } from '@/i18n';

/** Marks an item as a favorite; render it only for favorited items. */
export function FavoriteIndicator() {
  const t = useTranslation();

  return (
    <Icon
      icon={StarIcon}
      color="warning"
      accessibilityLabel={t.favorites.label}
    />
  );
}
