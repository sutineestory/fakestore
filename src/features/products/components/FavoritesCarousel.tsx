import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Button, Stack, Text } from '@/components';
import { FavoriteIndicator, useFavorites } from '@/features/favorites';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';
import { useCachedProducts } from '../hooks/useCachedProducts';
import { selectRecentFavoriteProductIds } from '../selectRecentFavoriteProductIds';
import { FavoritesRow } from './FavoritesRow';

const MAX_FAVORITES = 10;

type FavoritesCarouselProps = {
  onPressProduct: (id: number) => void;
};

/** The newest favorites as a swipeable row of cards above the product list. */
export function FavoritesCarousel({ onPressProduct }: FavoritesCarouselProps) {
  const t = useTranslation();
  const { favoriteIds } = useFavorites();
  const ids = useMemo(
    () => selectRecentFavoriteProductIds(favoriteIds, MAX_FAVORITES),
    [favoriteIds],
  );
  const { status, products, retry } = useCachedProducts(ids);

  return (
    <Stack gap="md">
      <Stack
        direction="row"
        gap="sm"
        align="center"
        accessible
        accessibilityRole="header"
        accessibilityLabel={t.productList.favorites}
      >
        <Text variant="heading">{t.productList.favorites}</Text>
        <FavoriteIndicator />
      </Stack>
      {products.length > 0 ? (
        <FavoritesRow products={products} onPressProduct={onPressProduct} />
      ) : (
        <CarouselStatus
          status={ids.length === 0 ? 'empty' : status}
          onRetry={retry}
        />
      )}
    </Stack>
  );
}

type CarouselStatusProps = {
  status: 'empty' | 'loading' | 'error' | 'success';
  onRetry: () => void;
};

/** Stands in for the cards while there are none to show. */
function CarouselStatus({ status, onRetry }: CarouselStatusProps) {
  const t = useTranslation();
  const { colors } = useTheme();

  switch (status) {
    case 'loading':
      return (
        <ActivityIndicator
          accessibilityLabel={t.productList.loading}
          color={colors.primary}
        />
      );
    case 'error':
      return (
        <Stack direction="row" gap="md" align="center">
          <Text variant="bodySmall" color="textMuted" style={styles.message}>
            {t.productList.favoritesError}
          </Text>
          <Button
            title={t.common.retry}
            variant="secondary"
            size="sm"
            onPress={onRetry}
          />
        </Stack>
      );
    // Success with no cards means every favorite is gone from the store.
    case 'empty':
    case 'success':
      return (
        <Text variant="bodySmall" color="textMuted">
          {t.productList.favoritesEmpty}
        </Text>
      );
  }
}

const styles = StyleSheet.create({
  message: { flex: 1 },
});
