import { useState } from 'react';

import { Button, Screen, Stack, Text, TextField } from '@/components';
import { FavoriteButton } from '@/features/favorites';
import { useTranslation } from '@/i18n';
import type { RootStackScreenProps } from '@/navigation';

export function DetailsScreen({
  navigation,
  route,
}: RootStackScreenProps<'Details'>) {
  const t = useTranslation();
  const { id, title } = route.params;
  const [note, setNote] = useState('');

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Text variant="caption" color="textMuted">
            {t.details.itemNumber(id)}
          </Text>
          <Text variant="title">{title}</Text>
        </Stack>

        <FavoriteButton id={id} />

        <TextField
          label={t.details.note.label}
          placeholder={t.details.note.placeholder}
          helperText={t.details.note.helperText}
          value={note}
          onChangeText={setNote}
        />

        <Stack gap="sm">
          <Button
            title={t.details.goBack}
            onPress={() => navigation.goBack()}
          />
          <Button
            title={t.details.openSettings}
            variant="secondary"
            onPress={() =>
              navigation.navigate('MainTabs', { screen: 'Settings' })
            }
          />
        </Stack>
      </Stack>
    </Screen>
  );
}
