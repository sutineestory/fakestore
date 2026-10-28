import { ShoppingCartIcon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import {
  Button,
  Chip,
  Icon,
  ImageViewer,
  RequestStatus,
  Screen,
  Stack,
  Text,
} from '@/components';
import { FavoriteIconButton } from '@/features/favorites';
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
  const [viewingImage, setViewingImage] = useState(false);
  const openImage = useCallback(() => setViewingImage(true), []);
  const closeImage = useCallback(() => setViewingImage(false), []);

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
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      footer={
        // Placeholder until there is a cart to add to.
        <Button
          title={t.productDetail.addToCart}
          icon={<Icon icon={ShoppingCartIcon} color="onPrimary" />}
        />
      }
    >
      <Stack gap="xl">
        <View style={styles.media}>
          <Pressable
            accessibilityRole="imagebutton"
            accessibilityLabel={t.productDetail.viewImage}
            onPress={openImage}
            style={styles.image}
          >
            <Image
              source={{ uri: product.image }}
              resizeMode="contain"
              style={styles.image}
            />
          </Pressable>
          <View style={styles.favorite}>
            <FavoriteIconButton id={productFavoriteId(product.id)} />
          </View>
        </View>

        <Stack gap="sm">
          <Chip label={product.category} />
          <Text variant="heading">{product.title}</Text>
          <Stack direction="row" justify="space-between" align="center">
            <ProductRating rating={product.rating} variant="stars" />
            <Text variant="heading" color="primary">
              {formatPrice(product.price, language)}
            </Text>
          </Stack>
        </Stack>

        <Text>{product.description}</Text>
      </Stack>

      <ImageViewer
        uri={product.image}
        visible={viewingImage}
        onClose={closeImage}
        closeLabel={t.productDetail.closeImage}
      />
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
  favorite: { position: 'absolute', top: spacing.sm, right: spacing.sm },
}));
