import { StarIcon } from 'lucide-react-native';
import { memo, useCallback } from 'react';
import { Image, View } from 'react-native';

import { Card, Icon, Stack, Text } from '@/components';
import { useLanguage, useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';
import { formatPrice } from '../formatPrice';
import type { Product } from '../types';

const THUMBNAIL_SIZE = 72;

type ProductListItemProps = {
  product: Product;
  /** Receives the product id, so the list can pass one stable callback. */
  onPress: (id: number) => void;
};

function ProductListItemBase({ product, onPress }: ProductListItemProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const { colors } = useTheme();
  const styles = useStyles();
  const { rate, count } = product.rating;
  const handlePress = useCallback(
    () => onPress(product.id),
    [onPress, product.id],
  );

  return (
    <Card onPress={handlePress}>
      <Stack direction="row" gap="md">
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
          <Stack
            direction="row"
            gap="xs"
            align="center"
            accessible
            accessibilityLabel={t.productDetail.rating(rate, count)}
          >
            <Icon
              icon={StarIcon}
              color="warning"
              fill={colors.warning}
              size="sm"
            />
            <Text variant="caption" color="textMuted">
              {t.productList.rating(rate, count)}
            </Text>
          </Stack>
          <Text variant="label" color="primary">
            {formatPrice(product.price, language)}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export const ProductListItem = memo(ProductListItemBase);

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    padding: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.media,
  },
  image: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between' },
}));
