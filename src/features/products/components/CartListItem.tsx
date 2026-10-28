import { Trash2Icon } from 'lucide-react-native';
import { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Stack } from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';
import type { Product } from '../types';
import { ProductListItem } from './ProductListItem';

type CartListItemProps = {
  product: Product;
  onPress: (id: number) => void;
  onRemove: (id: number) => void;
};

/**
 * A product row with a remove button beside it. Side by side rather than
 * nested, so screen readers reach both.
 */
function CartListItemBase({ product, onPress, onRemove }: CartListItemProps) {
  const t = useTranslation();
  const { spacing } = useTheme();
  const styles = useStyles();
  const handleRemove = useCallback(
    () => onRemove(product.id),
    [onRemove, product.id],
  );

  return (
    <Stack direction="row" gap="sm" align="center">
      <View style={styles.item}>
        <ProductListItem product={product} onPress={onPress} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.cart.removeItem(product.title)}
        hitSlop={spacing.sm}
        onPress={handleRemove}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
      >
        <Icon icon={Trash2Icon} color="danger" />
      </Pressable>
    </Stack>
  );
}

export const CartListItem = memo(CartListItemBase);

const useStyles = makeStyles(({ spacing }) => ({
  item: { flex: 1 },
  remove: { padding: spacing.sm },
  pressed: { opacity: 0.6 },
}));
