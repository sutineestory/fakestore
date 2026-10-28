import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Button, Stack, Text } from '@/components';
import { useFavorites } from '@/features/favorites';
import { useTranslation } from '@/i18n';
import { MAX_FAVORITE_PRODUCTS } from '../favoriteLimit';
import { useCachedProducts } from '../hooks/useCachedProducts';
import { selectRecentFavoriteProductIds } from '../selectRecentFavoriteProductIds';
import { FavoritesCarouselSkeleton } from './FavoritesCarouselSkeleton';
import { FavoritesRow } from './FavoritesRow';

type FavoritesCarouselProps = {
  onPressProduct: (id: number) => void;
};

/** The newest favorites as a swipeable row of cards above the product list. */
export function FavoritesCarousel({ onPressProduct }: FavoritesCarouselProps) {
  const t = useTranslation();
  const { favoriteIds } = useFavorites();
  const ids = useMemo(
    () => selectRecentFavoriteProductIds(favoriteIds, MAX_FAVORITE_PRODUCTS),
    [favoriteIds],
  );
  const { status, products, retry } = useCachedProducts(ids);

  return (
    <Stack gap="md">
      <Text variant="heading" accessibilityRole="header">
        {t.productList.favorites}
      </Text>
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

  switch (status) {
    case 'loading':
      return <FavoritesCarouselSkeleton label={t.productList.loading} />;
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
