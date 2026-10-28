import { BottomSheet, Button, Stack, Text } from '@/components';
import { useTranslation } from '@/i18n';
import { PRODUCT_SORTS, type ProductSort } from '../sortProducts';

type ProductSortSheetProps = {
  visible: boolean;
  value: ProductSort;
  onChange: (sort: ProductSort) => void;
  onClose: () => void;
};

/** Picks the order of the hot deals; choosing one closes the sheet. */
export function ProductSortSheet({
  visible,
  value,
  onChange,
  onClose,
}: ProductSortSheetProps) {
  const t = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Stack gap="lg">
        <Text variant="heading" accessibilityRole="header">
          {t.productList.sort.title}
        </Text>
        <Stack gap="sm">
          {PRODUCT_SORTS.map(sort => {
            const selected = sort === value;
            return (
              <Button
                key={sort}
                title={t.productList.sort.options[sort]}
                variant={selected ? 'primary' : 'secondary'}
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(sort);
                  onClose();
                }}
              />
            );
          })}
        </Stack>
      </Stack>
    </BottomSheet>
  );
}
