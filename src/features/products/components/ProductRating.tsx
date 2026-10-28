import { StarHalfIcon, StarIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Icon, Stack, Text } from '@/components';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';
import { starFills, type StarFill } from '../starFills';
import type { Product } from '../types';

type ProductRatingProps = {
  rating: Product['rating'];
  /** `compact`: one star, for list rows. `stars`: five stars filled to the score. */
  variant?: 'compact' | 'stars';
};

/** Stars with the score and review count; read out as one sentence. */
export function ProductRating({
  rating,
  variant = 'compact',
}: ProductRatingProps) {
  const t = useTranslation();
  const { rate, count } = rating;

  return (
    <Stack
      direction="row"
      gap="xs"
      align="center"
      accessible
      accessibilityLabel={t.productDetail.rating(rate, count)}
    >
      {variant === 'stars' ? (
        <Stack direction="row" gap="xxs">
          {starFills(rate).map((fill, index) => (
            <Star key={index} fill={fill} />
          ))}
        </Stack>
      ) : (
        <Star fill="full" />
      )}
      <Text variant="caption" color="textMuted">
        {t.productList.rating(rate, count)}
      </Text>
    </Stack>
  );
}

function Star({ fill }: { fill: StarFill }) {
  const { colors } = useTheme();

  if (fill === 'half') {
    // A filled left half drawn over an outline star.
    return (
      <View>
        <Icon icon={StarIcon} color="warning" size="sm" />
        <View style={StyleSheet.absoluteFill}>
          <Icon
            icon={StarHalfIcon}
            color="warning"
            fill={colors.warning}
            size="sm"
          />
        </View>
      </View>
    );
  }
  return (
    <Icon
      icon={StarIcon}
      color="warning"
      fill={fill === 'full' ? colors.warning : 'none'}
      size="sm"
    />
  );
}
