import { Stack, Text, TextField } from '@/components';
import { useTranslation } from '@/i18n';

type HotDealsHeaderProps = {
  query: string;
  onChangeQuery: (query: string) => void;
};

/** The hot deals heading with the search field under it. */
export function HotDealsHeader({ query, onChangeQuery }: HotDealsHeaderProps) {
  const t = useTranslation();

  return (
    <Stack gap="md">
      <Text variant="heading" accessibilityRole="header">
        {t.productList.hotDeals}
      </Text>
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
