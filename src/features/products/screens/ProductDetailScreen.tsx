import { Image, View } from 'react-native';

import { Chip, RequestStatus, Screen, Stack, Text } from '@/components';
import { FavoriteButton } from '@/features/favorites';
import { useLanguage, useTranslation } from '@/i18n';
import type { RootStackScreenProps } from '@/navigation';
import { makeStyles } from '@/theme';
import { ProductRating } from '../components/ProductRating';
import { formatPrice } from '../formatPrice';
import { useProduct } from '../hooks/useProduct';
import { productFavoriteId } from '../productFavoriteId';

const IMAGE_HEIGHT = 280;

export function ProductDetailScreen({
  route,
}: RootStackScreenProps<'ProductDetail'>) {
  const t = useTranslation();
  const { language } = useLanguage();
  const styles = useStyles();
  const { status, product, retry } = useProduct(route.params.id);

  if (!product) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <RequestStatus
          status={status}
          loadingLabel={t.productDetail.loading}
          errorMessage={t.productDetail.error}
          retryLabel={t.common.retry}
          emptyMessage={t.productDetail.notFound}
          onRetry={retry}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Stack gap="xl">
        <View style={styles.media}>
          <Image
            source={{ uri: product.image }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        <Stack gap="sm">
          <Chip label={product.category} />
          <Text variant="heading">{product.title}</Text>
          <Stack direction="row" justify="space-between" align="center">
            <ProductRating rating={product.rating} />
            <Text variant="heading" color="primary">
              {formatPrice(product.price, language)}
            </Text>
          </Stack>
        </Stack>

        <FavoriteButton id={productFavoriteId(product.id)} />

        <Text>{product.description}</Text>
      </Stack>
    </Screen>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  media: {
    height: IMAGE_HEIGHT,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.media,
  },
  image: { flex: 1 },
}));
