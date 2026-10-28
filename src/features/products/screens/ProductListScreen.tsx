import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import {
  ListSeparator,
  RefreshControl,
  RequestStatus,
  Screen,
} from '@/components';
import { useFavorites } from '@/features/favorites';
import { useTranslation } from '@/i18n';
import { makeStyles } from '@/theme';
import { ProductListFooter } from '../components/ProductListFooter';
import { ProductListItem } from '../components/ProductListItem';
import { productFavoriteId } from '../productFavoriteId';
import { useProducts } from '../ProductsProvider';
import type { Product } from '../types';

const keyExtractor = (product: Product) => String(product.id);

export function ProductListScreen() {
  const t = useTranslation();
  const styles = useStyles();
  const navigation = useNavigation();
  const { favoriteIds } = useFavorites();
  const {
    status,
    products,
    refreshing,
    loadingMore,
    loadMoreFailed,
    loadMore,
    retryLoadMore,
    refresh,
    retry,
  } = useProducts();

  const openProduct = useCallback(
    (id: number) => navigation.navigate('ProductDetail', { id }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
      <ProductListItem
        product={item}
        isFavorite={favoriteIds.has(productFavoriteId(item.id))}
        onPress={openProduct}
      />
    ),
    [favoriteIds, openProduct],
  );

  return (
    <Screen padded={false}>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={
          <RequestStatus
            status={status}
            loadingLabel={t.productList.loading}
            errorMessage={t.productList.error}
            retryLabel={t.common.retry}
            emptyMessage={t.productList.empty}
            onRetry={retry}
          />
        }
        ListFooterComponent={
          <ProductListFooter
            loadingMore={loadingMore}
            loadMoreFailed={loadMoreFailed}
            onRetry={retryLoadMore}
          />
        }
        contentContainerStyle={styles.content}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
    </Screen>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: { padding: spacing.lg },
}));
