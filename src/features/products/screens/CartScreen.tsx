import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import {
  Button,
  ListSeparator,
  RequestStatus,
  Screen,
  Stack,
  Text,
} from '@/components';
import { useCart } from '@/features/cart';
import { useLanguage, useTranslation } from '@/i18n';
import { makeStyles } from '@/theme';
import { CartListItem } from '../components/CartListItem';
import { ProductListSkeleton } from '../components/ProductListSkeleton';
import { formatPrice } from '../formatPrice';
import { useCachedProducts } from '../hooks/useCachedProducts';
import { sumPrices } from '../sumPrices';
import type { Product } from '../types';

const keyExtractor = (product: Product) => String(product.id);

export function CartScreen() {
  const t = useTranslation();
  const { language } = useLanguage();
  const styles = useStyles();
  const navigation = useNavigation();
  const { ids, remove, clear } = useCart();
  const { status, products, retry } = useCachedProducts(ids);

  const openProduct = useCallback(
    (id: number) => navigation.navigate('ProductDetail', { id }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
      <CartListItem product={item} onPress={openProduct} onRemove={remove} />
    ),
    [openProduct, remove],
  );

  return (
    <Screen
      padded={false}
      edges={['left', 'right', 'bottom']}
      footer={
        <Stack gap="md">
          <Stack direction="row" justify="space-between" align="center">
            <Text variant="subheading">{t.cart.total}</Text>
            <Text variant="heading" color="primary">
              {formatPrice(sumPrices(products), language)}
            </Text>
          </Stack>
          {/* Placeholder until orders can be placed. */}
          <Button title={t.cart.submit} disabled={products.length === 0} />
        </Stack>
      }
    >
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={
          products.length > 0 ? (
            <Stack direction="row" justify="space-between" align="center">
              <Text color="textMuted">{t.cart.itemCount(products.length)}</Text>
              <Button
                title={t.cart.removeAll}
                variant="ghost"
                size="sm"
                onPress={clear}
              />
            </Stack>
          ) : undefined
        }
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={
          ids.length > 0 && status === 'loading' ? (
            <ProductListSkeleton count={ids.length} label={t.cart.loading} />
          ) : (
            <RequestStatus
              status={ids.length === 0 ? 'success' : status}
              loadingLabel={t.cart.loading}
              errorMessage={t.cart.error}
              retryLabel={t.common.retry}
              emptyMessage={t.cart.empty}
              onRetry={retry}
            />
          )
        }
        contentContainerStyle={styles.content}
      />
    </Screen>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: { padding: spacing.lg },
  header: { paddingBottom: spacing.md },
}));
