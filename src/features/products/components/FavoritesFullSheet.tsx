import { BottomSheet, Button, Stack, Text } from '@/components';
import { useTranslation } from '@/i18n';
import { MAX_FAVORITE_PRODUCTS } from '../favoriteLimit';

type FavoritesFullSheetProps = {
  visible: boolean;
  onClose: () => void;
};

/** Explains that no more products can be favorited until one is removed. */
export function FavoritesFullSheet({
  visible,
  onClose,
}: FavoritesFullSheetProps) {
  const t = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="heading" accessibilityRole="header">
            {t.favorites.fullTitle}
          </Text>
          <Text color="textMuted">
            {t.favorites.fullMessage(MAX_FAVORITE_PRODUCTS)}
          </Text>
        </Stack>
        <Button title={t.common.ok} onPress={onClose} />
      </Stack>
    </BottomSheet>
  );
}
