import { StarIcon } from 'lucide-react-native';

import { Icon, Stack, Text } from '@/components';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';
import type { Product } from '../types';

type ProductRatingProps = {
  rating: Product['rating'];
};

/** A filled star with the score and review count; read out as one sentence. */
export function ProductRating({ rating }: ProductRatingProps) {
  const t = useTranslation();
  const { colors } = useTheme();
  const { rate, count } = rating;

  return (
    <Stack
      direction="row"
      gap="xs"
      align="center"
      accessible
      accessibilityLabel={t.productDetail.rating(rate, count)}
    >
      <Icon icon={StarIcon} color="warning" fill={colors.warning} size="sm" />
      <Text variant="caption" color="textMuted">
        {t.productList.rating(rate, count)}
      </Text>
    </Stack>
  );
}
