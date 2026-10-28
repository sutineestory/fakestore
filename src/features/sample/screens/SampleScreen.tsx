import { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  type ListRenderItem,
} from 'react-native';

import { RequestStatus, Screen, Stack, Text, TextField } from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';
import { SampleListItem } from '../components/SampleListItem';
import { filterSampleItems } from '../filterSampleItems';
import { useSampleItems } from '../hooks/useSampleItems';
import type { SampleItem } from '../types';

const keyExtractor = (item: SampleItem) => item.id;

const renderItem: ListRenderItem<SampleItem> = ({ item }) => (
  <SampleListItem item={item} />
);

function ItemSeparator() {
  const styles = useStyles();
  return <View style={styles.separator} />;
}

export function SampleScreen() {
  const t = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const { state, refreshing, retry, refresh } = useSampleItems();
  const [query, setQuery] = useState('');
  const search = query.trim();

  const items = useMemo(
    () =>
      state.status === 'success' ? filterSampleItems(state.items, search) : [],
    [state, search],
  );

  return (
    <Screen padded={false} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={
          <Stack gap="lg">
            <Text color="textMuted">{t.sample.subtitle}</Text>
            <TextField
              value={query}
              onChangeText={setQuery}
              placeholder={t.sample.search}
              accessibilityLabel={t.sample.search}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </Stack>
        }
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={
          <RequestStatus
            status={state.status}
            loadingLabel={t.sample.loading}
            errorMessage={t.sample.error}
            retryLabel={t.common.retry}
            emptyMessage={search ? t.sample.noResults(search) : t.sample.empty}
            onRetry={retry}
          />
        }
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
      />
    </Screen>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: { padding: spacing.lg },
  header: { paddingBottom: spacing.lg },
  separator: { height: spacing.md },
}));
