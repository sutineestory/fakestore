import { ShoppingCartIcon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import {
  Button,
  Chip,
  Icon,
  ImageViewer,
  NoticeSheet,
  RequestStatus,
  Screen,
  Stack,
  Text,
} from '@/components';
import { MAX_CART_ITEMS } from '@/features/cart';
import { FavoriteIconButton } from '@/features/favorites';
import { useLanguage, useTranslation } from '@/i18n';
import type { RootStackScreenProps } from '@/navigation';
import { makeStyles } from '@/theme';
import { ProductDetailSkeleton } from '../components/ProductDetailSkeleton';
import { ProductRating } from '../components/ProductRating';
import { MAX_FAVORITE_PRODUCTS } from '../favoriteLimit';
import { formatPrice } from '../formatPrice';
import { DETAIL_IMAGE_HEIGHT } from '../layout';
import { useAddToCart } from '../hooks/useAddToCart';
import { useFavoriteProductLimit } from '../hooks/useFavoriteProductLimit';
import { useProduct } from '../hooks/useProduct';
import { productFavoriteId } from '../productFavoriteId';

export function ProductDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<'ProductDetail'>) {
  const t = useTranslation();
  const { language } = useLanguage();
  const styles = useStyles();
  const { id } = route.params;
  const { status, product, retry } = useProduct(id);
  const cart = useAddToCart(id);
  const openCart = useCallback(() => navigation.navigate('Cart'), [navigation]);
  const [viewingImage, setViewingImage] = useState(false);
  const openImage = useCallback(() => setViewingImage(true), []);
  const closeImage = useCallback(() => setViewingImage(false), []);
  const { beforeAdd, limitReached, dismissLimit } = useFavoriteProductLimit();

  if (!product && status === 'loading') {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <ProductDetailSkeleton label={t.productDetail.loading} />
      </Screen>
    );
  }

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
        <Button
          title={
            cart.inCart ? t.productDetail.viewCart : t.productDetail.addToCart
          }
          variant={cart.inCart ? 'secondary' : 'primary'}
          icon={
            <Icon
              icon={ShoppingCartIcon}
              color={cart.inCart ? 'text' : 'onPrimary'}
            />
          }
          onPress={cart.inCart ? openCart : cart.addToCart}
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
            <FavoriteIconButton
              id={productFavoriteId(product.id)}
              beforeAdd={beforeAdd}
            />
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
      <NoticeSheet
        visible={limitReached}
        title={t.favorites.fullTitle}
        message={t.favorites.fullMessage(MAX_FAVORITE_PRODUCTS)}
        okLabel={t.common.ok}
        onClose={dismissLimit}
      />
      <NoticeSheet
        visible={cart.limitReached}
        title={t.cart.fullTitle}
        message={t.cart.fullMessage(MAX_CART_ITEMS)}
        okLabel={t.common.ok}
        onClose={cart.dismissLimit}
      />
    </Screen>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  media: {
    height: DETAIL_IMAGE_HEIGHT,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.media,
  },
  image: { flex: 1 },
  favorite: { position: 'absolute', top: spacing.sm, right: spacing.sm },
}));
