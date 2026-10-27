import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from '@/features/favorites';
import { LanguageProvider } from '@/i18n';
import { RootNavigator } from '@/navigation';
import { ThemeProvider, useTheme } from '@/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <FavoritesProvider>
            <ThemedStatusBar />
            <RootNavigator />
          </FavoritesProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStatusBar() {
  const { dark } = useTheme();
  return <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />;
}
