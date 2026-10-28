import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { ComponentType, ReactNode } from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { FavoritesProvider } from '@/features/favorites';
import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { ProductsProvider } from './ProductsProvider';
import type { Product } from './types';

const { act } = ReactTestRenderer;

export function makeProduct(id: number, overrides?: Partial<Product>): Product {
  return {
    id,
    title: `Product ${id}`,
    price: id + 0.5,
    description: `Description of product ${id}.`,
    category: 'electronics',
    image: `https://fakestoreapi.com/img/${id}.png`,
    rating: { rate: 4.1, count: 10 * id },
    ...overrides,
  };
}

/** Products `from`..`to`, inclusive. */
export function makeProducts(from: number, to: number): Product[] {
  return Array.from({ length: to - from + 1 }, (_, index) =>
    makeProduct(from + index),
  );
}

export type RenderOptions = {
  initialFavoriteIds?: string[];
  language?: Language;
};

/** Renders `navigator` inside every provider a products screen needs. */
export async function renderWithProviders(
  navigator: ReactNode,
  { initialFavoriteIds, language }: RenderOptions = {},
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
            <ProductsProvider>
              <NavigationContainer>{navigator}</NavigationContainer>
            </ProductsProvider>
          </FavoritesProvider>
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer;
}

type TestStackParamList = {
  Screen: undefined;
  ProductDetail: { id: number };
};

const TestStack = createNativeStackNavigator<TestStackParamList>();

function OpenedProduct({
  route,
}: NativeStackScreenProps<TestStackParamList, 'ProductDetail'>) {
  return <Text>{`Opened product ${route.params.id}`}</Text>;
}

/**
 * Renders `Screen` as the first route of a stack whose ProductDetail route
 * only says which product was opened.
 */
export function renderProductsScreen(
  Screen: ComponentType,
  options?: RenderOptions,
) {
  return renderWithProviders(
    <TestStack.Navigator>
      <TestStack.Screen name="Screen" component={Screen} />
      <TestStack.Screen name="ProductDetail" component={OpenedProduct} />
    </TestStack.Navigator>,
    options,
  );
}
