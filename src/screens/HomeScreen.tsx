import { ChevronRightIcon } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { Button, Card, Icon, Screen, Stack, Text } from '@/components';
import { FavoriteIndicator, useFavorites } from '@/features/favorites';
import { useTranslation, type Messages } from '@/i18n';
import type { MainTabScreenProps } from '@/navigation';

// Placeholder content until real features land.
const ITEMS: { id: string; messageKey: keyof Messages['home']['items'] }[] = [
  { id: '1', messageKey: 'gettingStarted' },
  { id: '2', messageKey: 'designSystem' },
  { id: '3', messageKey: 'navigation' },
  { id: '4', messageKey: 'appContext' },
];

export function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const t = useTranslation();
  const { favoriteIds } = useFavorites();

  return (
    <Screen scroll>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text variant="title">{t.home.title}</Text>
          <Text color="textMuted">{t.home.subtitle}</Text>
        </Stack>

        {ITEMS.map(item => {
          const { title, description } = t.home.items[item.messageKey];
          return (
            <Card
              key={item.id}
              onPress={() =>
                navigation.navigate('Details', { id: item.id, title })
              }
            >
              <Stack direction="row" align="center" gap="md">
                <Stack gap="xs" style={styles.content}>
                  <Text variant="subheading">{title}</Text>
                  <Text variant="bodySmall" color="textMuted">
                    {description}
                  </Text>
                </Stack>
                {favoriteIds.has(item.id) && <FavoriteIndicator />}
                <Icon icon={ChevronRightIcon} color="textMuted" />
              </Stack>
            </Card>
          );
        })}

        <Button
          title={t.home.openSample}
          variant="secondary"
          onPress={() => navigation.navigate('Sample')}
        />
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
});
