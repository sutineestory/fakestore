import { Pressable } from 'react-native';

import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';
import { useAnimatedFavorite } from '../hooks/useAnimatedFavorite';
import { AnimatedHeart } from './AnimatedHeart';

type FavoriteIconButtonProps = {
  id: string;
  /** Return false to stop the item being added, e.g. when the list is full. */
  beforeAdd?: () => boolean;
};

/** Round heart-only toggle; the label tells screen readers what it does. */
export function FavoriteIconButton({ id, beforeAdd }: FavoriteIconButtonProps) {
  const t = useTranslation();
  const { spacing } = useTheme();
  const styles = useStyles();
  const { isFavorite, scale, press } = useAnimatedFavorite(id, beforeAdd);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? t.favorites.remove : t.favorites.add}
      accessibilityState={{ selected: isFavorite }}
      hitSlop={spacing.sm}
      onPress={press}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AnimatedHeart filled={isFavorite} scale={scale} />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  button: {
    padding: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.8 },
}));
