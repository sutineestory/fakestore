import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import {
  Divider,
  ListSeparator,
  RefreshControl,
  RequestStatus,
  Screen,
  Stack,
  Text,
} from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles } from '@/theme';
import { FavoritesCarousel } from '../components/FavoritesCarousel';
import { ProductListFooter } from '../components/ProductListFooter';
import { ProductListItem } from '../components/ProductListItem';
import { useProducts } from '../ProductsProvider';
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
  } = useProducts();

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
            <Text variant="heading" accessibilityRole="header">
              {t.productList.hotDeals}
            </Text>
          </Stack>
        }
        ListHeaderComponentStyle={styles.header}
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
  header: { paddingBottom: spacing.lg },
}));
