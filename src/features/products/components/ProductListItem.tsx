import { memo, useCallback } from 'react';
import { Image, View } from 'react-native';

import { Card, Stack, Text } from '@/components';
import { useLanguage } from '@/i18n';
import { makeStyles } from '@/theme';
import { formatPrice } from '../formatPrice';
import { ROW_IMAGE_WIDTH } from '../layout';
import type { Product } from '../types';
import { ProductRating } from './ProductRating';

type ProductListItemProps = {
  product: Product;
  /** Receives the product id, so the list can pass one stable callback. */
  onPress: (id: number) => void;
};

function ProductListItemBase({ product, onPress }: ProductListItemProps) {
  const { language } = useLanguage();
  const styles = useStyles();
  const handlePress = useCallback(
    () => onPress(product.id),
    [onPress, product.id],
  );

  return (
    <Card onPress={handlePress} style={styles.card}>
      <Stack direction="row">
        <View style={styles.thumbnail}>
          <Image
            source={{ uri: product.image }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <Stack gap="sm" style={styles.content}>
          <Text variant="subheading" numberOfLines={2}>
            {product.title}
          </Text>
          <Stack direction="row" justify="space-between" align="center">
            <ProductRating rating={product.rating} />
            <Text variant="label" color="primary">
              {formatPrice(product.price, language)}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export const ProductListItem = memo(ProductListItemBase);

const useStyles = makeStyles(({ colors, spacing }) => ({
  // The photo runs to the card's edges; the card's corners clip it.
  card: { padding: 0, overflow: 'hidden' },
  thumbnail: { width: ROW_IMAGE_WIDTH, backgroundColor: colors.media },
  image: { flex: 1 },
  content: { flex: 1, padding: spacing.md, justifyContent: 'space-between' },
}));
