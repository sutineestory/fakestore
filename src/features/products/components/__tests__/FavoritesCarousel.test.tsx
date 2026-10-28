import { FlatList, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { fetchProduct, fetchProducts } from '../../services/productsService';
import {
  makeProduct,
  makeProducts,
  renderWithProviders,
  type RenderOptions,
} from '../../testUtils';
import type { Product } from '../../types';
import { FavoritesCarousel } from '../FavoritesCarousel';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

/** Skeleton areas announced as loading; host views only, so each counts once. */
function loadingAreas(root: ReactTestInstance) {
  return root.findAll(
    node =>
      typeof node.type === 'string' &&
      node.props.accessibilityRole === 'progressbar',
  );
}

const mockFetchProducts = jest.mocked(fetchProducts);
const mockFetchProduct = jest.mocked(fetchProduct);

let renderer: Renderer | undefined;

async function renderCarousel(
  options?: RenderOptions,
  onPressProduct: (id: number) => void = jest.fn(),
) {
  renderer = await renderWithProviders(
    <FavoritesCarousel onPressProduct={onPressProduct} />,
    options,
  );
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function cardIds(root: ReactTestInstance): number[] {
  const list = root.findAllByType(FlatList)[0];
  return list ? list.props.data.map((product: Product) => product.id) : [];
}

function favoritesOf(ids: number[]) {
  return ids.map(id => `product:${id}`);
}

beforeEach(() => {
  jest.useFakeTimers();
  mockFetchProducts.mockReset();
  mockFetchProduct.mockReset();
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
  mockFetchProduct.mockImplementation(async id => makeProduct(id));
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  jest.useRealTimers();
});

test('is announced as the Favorites header', async () => {
  const root = await renderCarousel();

  const header = root.find(
    node =>
      node.props.accessibilityRole === 'header' &&
      typeof node.type === 'string',
  );
  expect(header.props.children).toBe('Favorites');
});

test('explains how to add favorites when there are none', async () => {
  const root = await renderCarousel();

  expect(texts(root)).toContain(
    'Tap “Add to favorites” on a product to keep it here.',
  );
  expect(cardIds(root)).toEqual([]);
});

test('shows the newest favorites first, ignoring Home items', async () => {
  const root = await renderCarousel({
    initialFavoriteIds: ['product:4', '2', 'product:1', 'product:7'],
  });

  expect(cardIds(root)).toEqual([7, 1, 4]);
});

test('shows at most five favorites', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 20));

  const root = await renderCarousel({
    initialFavoriteIds: favoritesOf(makeProducts(1, 12).map(p => p.id)),
  });

  expect(cardIds(root)).toEqual([12, 11, 10, 9, 8]);
});

test('fetches favorites the list has not loaded yet', async () => {
  const root = await renderCarousel({
    initialFavoriteIds: favoritesOf([15, 2]),
  });

  expect(mockFetchProduct).toHaveBeenCalledWith(15);
  expect(cardIds(root)).toEqual([2, 15]);
});

test('shows placeholder cards while favorites load', async () => {
  mockFetchProducts.mockReturnValue(new Promise(() => {}));

  const root = await renderCarousel({ initialFavoriteIds: favoritesOf([3]) });

  const [skeleton] = loadingAreas(root);
  expect(skeleton.props.accessibilityLabel).toBe('Loading products');
});

test('offers a retry when favorites fail to load', async () => {
  mockFetchProduct.mockRejectedValueOnce(new Error('Network down'));

  const root = await renderCarousel({ initialFavoriteIds: favoritesOf([15]) });

  expect(texts(root)).toContain('Couldn’t load your favorites.');

  const retry = root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  await act(async () => {
    retry.props.onPress();
  });

  expect(cardIds(root)).toEqual([15]);
});

test('falls back to the hint when no favorite still exists', async () => {
  mockFetchProduct.mockResolvedValue(null);

  const root = await renderCarousel({ initialFavoriteIds: favoritesOf([99]) });

  expect(texts(root)).toContain(
    'Tap “Add to favorites” on a product to keep it here.',
  );
});

test('opens the pressed favorite', async () => {
  const onPressProduct = jest.fn();
  const root = await renderCarousel(
    { initialFavoriteIds: favoritesOf([3]) },
    onPressProduct,
  );

  const card = root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  await act(async () => {
    card.props.onPress();
  });

  expect(onPressProduct).toHaveBeenCalledWith(3);
});
