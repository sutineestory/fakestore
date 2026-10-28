import { StyleSheet } from 'react-native';

import {
  BottomSheet,
  Button,
  Chip,
  RequestStatus,
  Stack,
  Text,
} from '@/components';
import { useTranslation } from '@/i18n';
import { useProductCategories } from '../hooks/useProductCategories';

type ProductFilterSheetProps = {
  visible: boolean;
  /** The chosen categories. */
  selected: readonly string[];
  onToggle: (category: string) => void;
  onClear: () => void;
  onClose: () => void;
};

/**
 * Category toggles for the hot deals. Each change applies straight away, so
 * the list behind already shows the result when the sheet closes.
 */
export function ProductFilterSheet({
  visible,
  selected,
  onToggle,
  onClear,
  onClose,
}: ProductFilterSheetProps) {
  const t = useTranslation();
  // Loaded with the screen rather than on open, so the sheet opens ready.
  const { status, categories, retry } = useProductCategories();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Stack gap="lg">
        <Text variant="heading" accessibilityRole="header">
          {t.productList.filter.title}
        </Text>
        {categories.length > 0 ? (
          <Stack direction="row" gap="sm" wrap>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                selected={selected.includes(category)}
                onPress={() => onToggle(category)}
              />
            ))}
          </Stack>
        ) : (
          <RequestStatus
            status={status}
            loadingLabel={t.productList.filter.loading}
            errorMessage={t.productList.filter.error}
            retryLabel={t.common.retry}
            emptyMessage={t.productList.filter.empty}
            onRetry={retry}
          />
        )}
        <Stack direction="row" gap="sm">
          <Button
            title={t.productList.filter.clear}
            variant="secondary"
            disabled={selected.length === 0}
            onPress={onClear}
            style={styles.action}
          />
          <Button
            title={t.productList.filter.done}
            onPress={onClose}
            style={styles.action}
          />
        </Stack>
      </Stack>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  action: { flex: 1 },
});
