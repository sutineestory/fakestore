import { HeartIcon } from 'lucide-react-native';

import { Icon } from '@/components';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';

/** Marks an item as a favorite; render it only for favorited items. */
export function FavoriteIndicator() {
  const t = useTranslation();
  const { colors } = useTheme();

  return (
    <Icon
      icon={HeartIcon}
      color="favorite"
      fill={colors.favorite}
      accessibilityLabel={t.favorites.label}
    />
  );
}
