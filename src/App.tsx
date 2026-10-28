import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '@/features/cart';
import { FavoritesProvider } from '@/features/favorites';
import { ProductsProvider } from '@/features/products';
import { LanguageProvider } from '@/i18n';
import { RootNavigator } from '@/navigation';
import { ThemeProvider, useTheme } from '@/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <FavoritesProvider>
            <ProductsProvider>
              <CartProvider>
                <ThemedStatusBar />
                <RootNavigator />
              </CartProvider>
            </ProductsProvider>
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
