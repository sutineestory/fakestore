import { memo } from 'react';

import { Card, Stack, Text } from '@/components';
import type { SampleItem } from '../types';

type SampleListItemProps = {
  item: SampleItem;
};

function SampleListItemBase({ item }: SampleListItemProps) {
  return (
    <Card>
      <Stack gap="xs">
        <Text variant="subheading">{item.title}</Text>
        <Text variant="bodySmall" color="textMuted">
          {item.description}
        </Text>
      </Stack>
    </Card>
  );
}

export const SampleListItem = memo(SampleListItemBase);
