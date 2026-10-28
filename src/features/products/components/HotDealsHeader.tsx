import { ArrowUpDownIcon, SlidersHorizontalIcon } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { Stack, Text, TextField } from '@/components';
import { useTranslation } from '@/i18n';
import type { ProductSort } from '../sortProducts';
import { RefineButton } from './RefineButton';

type HotDealsHeaderProps = {
  query: string;
  onChangeQuery: (query: string) => void;
  /** How many categories the list is filtered to. */
  filterCount: number;
  onPressFilter: () => void;
  sort: ProductSort;
  onPressSort: () => void;
};

/**
 * The hot deals heading and its filter and sort buttons, with the search
 * field under them.
 */
export function HotDealsHeader({
  query,
  onChangeQuery,
  filterCount,
  onPressFilter,
  sort,
  onPressSort,
}: HotDealsHeaderProps) {
  const t = useTranslation();

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Text variant="heading" accessibilityRole="header" style={styles.title}>
          {t.productList.hotDeals}
        </Text>
        <RefineButton
          title={t.productList.filter.button(filterCount)}
          icon={SlidersHorizontalIcon}
          active={filterCount > 0}
          onPress={onPressFilter}
        />
        <RefineButton
          title={t.productList.sort.button}
          icon={ArrowUpDownIcon}
          active={sort !== 'recommended'}
          value={t.productList.sort.options[sort]}
          onPress={onPressSort}
        />
      </Stack>
      <TextField
        value={query}
        onChangeText={onChangeQuery}
        placeholder={t.productList.search}
        accessibilityLabel={t.productList.search}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  title: { flex: 1 },
});
