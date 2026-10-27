import {
  Button,
  Card,
  Divider,
  Screen,
  SegmentedControl,
  Stack,
  Text,
} from '@/components';
import {
  languageNames,
  languages,
  useLanguage,
  useTranslation,
} from '@/i18n';
import { useColorSchemePreference, type ColorSchemePreference } from '@/theme';

const COLOR_SCHEME_PREFERENCES: ColorSchemePreference[] = [
  'system',
  'light',
  'dark',
];

const LANGUAGE_OPTIONS = languages.map(language => ({
  value: language,
  label: languageNames[language],
}));

export function SettingsScreen() {
  const t = useTranslation();
  const { preference, setPreference } = useColorSchemePreference();
  const { language, setLanguage } = useLanguage();

  const appearanceOptions = COLOR_SCHEME_PREFERENCES.map(value => ({
    value,
    label: t.settings.colorSchemes[value],
  }));

  return (
    <Screen scroll>
      <Stack gap="xl">
        <Stack gap="sm">
          <Text variant="heading">{t.settings.appearance}</Text>
          <SegmentedControl
            options={appearanceOptions}
            value={preference}
            onChange={setPreference}
          />
        </Stack>

        <Stack gap="sm">
          <Text variant="heading">{t.settings.language}</Text>
          <SegmentedControl
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
          />
        </Stack>

        <Divider />

        {/* Live preview of shared components — handy while building out the design system. */}
        <Stack gap="sm">
          <Text variant="heading">{t.settings.components}</Text>
          <Button title={t.settings.buttons.primary} />
          <Button title={t.settings.buttons.secondary} variant="secondary" />
          <Button title={t.settings.buttons.ghost} variant="ghost" />
          <Button title={t.settings.buttons.danger} variant="danger" />
          <Button title={t.settings.buttons.loading} loading />
          <Button title={t.settings.buttons.disabled} disabled />
          <Card>
            <Text variant="subheading">{t.settings.card.title}</Text>
            <Text variant="bodySmall" color="textMuted">
              {t.settings.card.description}
            </Text>
          </Card>
        </Stack>
      </Stack>
    </Screen>
  );
}
