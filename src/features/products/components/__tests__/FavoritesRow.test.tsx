import { FlatList, StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider } from '@/i18n';
import { lightTheme, ThemeProvider } from '@/theme';
import { makeProducts } from '../../testUtils';
import type { Product } from '../../types';
import { FavoritesRow } from '../FavoritesRow';

const { act } = ReactTestRenderer;

let renderer: Renderer | undefined;

function rowOf(products: Product[], onPressProduct = jest.fn()) {
  return (
    <ThemeProvider initialPreference="light">
      <LanguageProvider>
        <FavoritesRow products={products} onPressProduct={onPressProduct} />
      </LanguageProvider>
    </ThemeProvider>
  );
}

async function renderRow(products: Product[], onPressProduct = jest.fn()) {
  await act(async () => {
    renderer = ReactTestRenderer.create(rowOf(products, onPressProduct));
  });
  return (renderer as Renderer).root;
}

/** Index of the highlighted page dot. */
function activeDot(root: ReactTestInstance) {
  const dots = root
    .find(node => node.props.accessibilityElementsHidden === true)
    .findAllByType(View)
    .slice(1);
  return dots.findIndex(
    dot =>
      StyleSheet.flatten(dot.props.style).backgroundColor ===
      lightTheme.colors.primary,
  );
}

async function settleAt(root: ReactTestInstance, x: number) {
  const list = root.findByType(FlatList);
  await act(async () => {
    list.props.onMomentumScrollEnd({
      nativeEvent: {
        contentOffset: { x },
        layoutMeasurement: { width: 300 },
        contentSize: { width: 1200 },
      },
    });
  });
  return list.props.snapToInterval as number;
}

// FlatList renders more cells on a timer; unmounting cancels it.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  jest.useRealTimers();
});

test('shows a card per product, in order', async () => {
  const root = await renderRow(makeProducts(1, 3));

  expect(
    root
      .findAllByType(Text)
      .map(text => text.props.children)
      .filter(text => String(text).startsWith('Product')),
  ).toEqual(['Product 1', 'Product 2', 'Product 3']);
});

test('swipes horizontally, snapping card by card', async () => {
  const root = await renderRow(makeProducts(1, 3));

  const list = root.findByType(FlatList);
  expect(list.props.horizontal).toBe(true);
  expect(list.props.snapToInterval).toBeGreaterThan(0);
});

test('moves the active dot to the card it settles on', async () => {
  const root = await renderRow(makeProducts(1, 6));

  expect(activeDot(root)).toBe(0);

  const interval = await settleAt(root, 0);
  await settleAt(root, interval * 2);

  expect(activeDot(root)).toBe(2);

  await settleAt(root, 900);

  expect(activeDot(root)).toBe(5);
});

test('keeps a dot active when favorites are removed', async () => {
  const root = await renderRow(makeProducts(1, 6));
  await settleAt(root, 900);

  await act(async () => {
    renderer?.update(rowOf(makeProducts(1, 3)));
  });

  expect(activeDot(root)).toBe(2);
});

test('opens the pressed product', async () => {
  const onPressProduct = jest.fn();
  const root = await renderRow(makeProducts(1, 3), onPressProduct);

  const second = root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  )[1];
  await act(async () => {
    second.props.onPress();
  });

  expect(onPressProduct).toHaveBeenCalledWith(2);
});
