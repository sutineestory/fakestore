import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import {
  Divider,
  ListSeparator,
  RefreshControl,
  RequestStatus,
  Screen,
  Stack,
} from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles } from '@/theme';
import { FavoritesCarousel } from '../components/FavoritesCarousel';
import { HotDealsHeader } from '../components/HotDealsHeader';
import { ProductListFooter } from '../components/ProductListFooter';
import { ProductListItem } from '../components/ProductListItem';
import { ProductSortSheet } from '../components/ProductSortSheet';
import { useHotDeals } from '../hooks/useHotDeals';
import type { Product } from '../types';

const keyExtractor = (product: Product) => String(product.id);

export function ProductListScreen() {
  const t = useTranslation();
  const styles = useStyles();
  const navigation = useNavigation();
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
    query,
    setQuery,
    search,
    sort,
    setSort,
  } = useHotDeals();
  const [sorting, setSorting] = useState(false);
  const openSort = useCallback(() => setSorting(true), []);
  const closeSort = useCallback(() => setSorting(false), []);

  const openProduct = useCallback(
    (id: number) => navigation.navigate('ProductDetail', { id }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => <ProductListItem product={item} onPress={openProduct} />,
    [openProduct],
  );

  return (
    <Screen padded={false}>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={
          <Stack gap="lg">
            <FavoritesCarousel onPressProduct={openProduct} />
            <Divider />
            <HotDealsHeader
              query={query}
              onChangeQuery={setQuery}
              sort={sort}
              onPressSort={openSort}
            />
          </Stack>
        }
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={
          // The footer's spinner already shows while more pages load.
          loadingMore ? undefined : (
            <RequestStatus
              status={status}
              loadingLabel={t.productList.loading}
              errorMessage={t.productList.error}
              retryLabel={t.common.retry}
              emptyMessage={
                search ? t.productList.noResults(search) : t.productList.empty
              }
              onRetry={retry}
            />
          )
        }
        ListFooterComponent={
          <ProductListFooter
            loadingMore={loadingMore}
            loadMoreFailed={loadMoreFailed}
            onRetry={retryLoadMore}
          />
        }
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
      <ProductSortSheet
        visible={sorting}
        value={sort}
        onChange={setSort}
        onClose={closeSort}
      />
    </Screen>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: { padding: spacing.lg },
  header: { paddingBottom: spacing.lg },
}));
