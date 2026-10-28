import { useCallback, useState } from 'react';
import {
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { PageDots, Stack } from '@/components';
import { makeStyles } from '@/theme';
import { carouselIndex } from '@/utils/carouselIndex';
import { useFavoriteCardLayout } from '../hooks/useFavoriteCardLayout';
import type { Product } from '../types';
import { FavoriteProductCard } from './FavoriteProductCard';

const keyExtractor = (product: Product) => String(product.id);

type FavoritesRowProps = {
  products: Product[];
  onPressProduct: (id: number) => void;
};

/** Horizontally snapping cards with page dots under them. */
export function FavoritesRow({ products, onPressProduct }: FavoritesRowProps) {
  const styles = useStyles();
  const { cardWidth, interval } = useFavoriteCardLayout();
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
      <FavoriteProductCard
        product={item}
        width={cardWidth}
        onPress={onPressProduct}
      />
    ),
    [cardWidth, onPressProduct],
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) =>
      setActiveIndex(
        carouselIndex(event.nativeEvent, interval, products.length),
      ),
    [interval, products.length],
  );

  return (
    <Stack gap="md">
      <FlatList
        horizontal
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
      {/* A removed favorite can leave the index past the end. */}
      <PageDots
        count={products.length}
        activeIndex={Math.min(activeIndex, products.length - 1)}
      />
    </Stack>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: { gap: spacing.md },
}));
