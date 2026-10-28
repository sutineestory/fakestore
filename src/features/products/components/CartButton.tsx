import { ShoppingCartIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Icon } from '@/components';
import { useTranslation } from '@/i18n';
import { makeStyles, useTheme } from '@/theme';

/** Header cart button. A placeholder: there is no cart to open yet. */
export function CartButton() {
  const t = useTranslation();
  const { spacing } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.common.cart}
      hitSlop={spacing.sm}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon icon={ShoppingCartIcon} />
    </Pressable>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  button: { padding: spacing.xs },
  pressed: { opacity: 0.6 },
}));
