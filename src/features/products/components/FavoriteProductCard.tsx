import { memo, useCallback } from 'react';
import { Image, View } from 'react-native';

import { Card, Stack, Text } from '@/components';
import { FavoriteIndicator } from '@/features/favorites';
import { useLanguage } from '@/i18n';
import { makeStyles } from '@/theme';
import { formatPrice } from '../formatPrice';
import type { Product } from '../types';

const IMAGE_HEIGHT = 96;

type FavoriteProductCardProps = {
  product: Product;
  width: number;
  /** Receives the product id, so the carousel can pass one stable callback. */
  onPress: (id: number) => void;
};

function FavoriteProductCardBase({
  product,
  width,
  onPress,
}: FavoriteProductCardProps) {
  const { language } = useLanguage();
  const styles = useStyles();
  const handlePress = useCallback(
    () => onPress(product.id),
    [onPress, product.id],
  );

  return (
    <Card onPress={handlePress} style={[styles.card, { width }]}>
      <Stack>
        <View style={styles.media}>
          <Image
            source={{ uri: product.image }}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={styles.badge}>
            <FavoriteIndicator />
          </View>
        </View>
        <Stack gap="xxs" style={styles.details}>
          <Text variant="caption" numberOfLines={1}>
            {product.title}
          </Text>
          <Text variant="label" color="primary" align="right">
            {formatPrice(product.price, language)}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export const FavoriteProductCard = memo(FavoriteProductCardBase);

const useStyles = makeStyles(({ colors, spacing }) => ({
  // The photo runs to the card's edges; the card's corners clip it.
  card: { padding: 0, overflow: 'hidden' },
  media: { height: IMAGE_HEIGHT, backgroundColor: colors.media },
  image: { flex: 1 },
  badge: { position: 'absolute', top: spacing.xs, right: spacing.xs },
  details: { padding: spacing.sm },
}));
