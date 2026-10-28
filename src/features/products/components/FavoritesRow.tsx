import { useCallback, useState } from 'react';
import {
  FlatList,
  useWindowDimensions,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { PageDots, Stack } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { carouselIndex } from '@/utils/carouselIndex';
import type { Product } from '../types';
import { FavoriteProductCard } from './FavoriteProductCard';

// Two and a half cards on screen, so the cut-off one hints at scrolling.
const VISIBLE_CARDS = 2.5;

const keyExtractor = (product: Product) => String(product.id);

type FavoritesRowProps = {
  products: Product[];
  onPressProduct: (id: number) => void;
};

/** Horizontally snapping cards with page dots under them. */
export function FavoritesRow({ products, onPressProduct }: FavoritesRowProps) {
  const { spacing } = useTheme();
  const styles = useStyles();
  const { width: windowWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  // The list around the row is inset by `lg` on both sides.
  const cardWidth = Math.round(
    (windowWidth - spacing.lg * 2 - spacing.md * 2) / VISIBLE_CARDS,
  );
  const interval = cardWidth + spacing.md;

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
