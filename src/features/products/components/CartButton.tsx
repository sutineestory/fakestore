import { useNavigation } from '@react-navigation/native';
import { ShoppingCartIcon } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '@/components';
import { useCart } from '@/features/cart';
import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';

const BADGE_SIZE = 18;

/** Header button that opens the cart, with a count of what's in it. */
export function CartButton() {
  const t = useTranslation();
  const { spacing } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const { ids } = useCart();
  const count = ids.length;

  const openCart = useCallback(() => navigation.navigate('Cart'), [navigation]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        count > 0
          ? `${t.common.cart}, ${t.cart.itemCount(count)}`
          : t.common.cart
      }
      hitSlop={spacing.sm}
      onPress={openCart}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon icon={ShoppingCartIcon} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text variant="caption" color="onPrimary" style={styles.badgeText}>
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  button: { padding: spacing.xs },
  pressed: { opacity: 0.6 },
  badge: {
    position: 'absolute',
    top: -spacing.xxs,
    right: -spacing.xs,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: spacing.xxs,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeText: { lineHeight: BADGE_SIZE },
}));
