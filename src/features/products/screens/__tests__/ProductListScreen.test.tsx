import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { fetchProducts } from '../../services/productsService';
import {
  makeProducts,
  renderProductsScreen,
  type RenderOptions,
} from '../../testUtils';
import type { Product } from '../../types';
import { ProductListScreen } from '../ProductListScreen';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);

function nextRequest() {
  const request = Promise.withResolvers<Product[]>();
  mockFetchProducts.mockReturnValueOnce(request.promise);
  return request;
}

let renderer: Renderer | undefined;

async function renderScreen(options?: RenderOptions) {
  renderer = await renderProductsScreen(ProductListScreen, options);
  return renderer.root;
}

async function renderLoadedScreen(options?: RenderOptions) {
  const request = nextRequest();
  const root = await renderScreen(options);
  await act(async () => request.resolve(makeProducts(1, 10)));
  return root;
}

function hasText(root: ReactTestInstance, text: string) {
  return root.findAllByType(Text).some(node => node.props.children === text);
}

/** Every pressable showing `title`: its list row, plus its card if favorited. */
function findRows(root: ReactTestInstance, title: string) {
  return root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAllByType(Text).some(text => text.props.children === title),
  );
}

function hasFavoriteMark(row: ReactTestInstance) {
  return (
    row.findAll(node => node.props.accessibilityLabel === 'Favorite').length > 0
  );
}

function findButton(root: ReactTestInstance, label: string) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      hasText(node, label),
  );
}

async function reachEnd(root: ReactTestInstance) {
  await act(async () => {
    root.findByType(FlatList).props.onEndReached({ distanceFromEnd: 0 });
  });
}

// FlatList renders more rows on a timer; fake timers keep that from firing
// mid-test, and unmounting cancels it.
beforeEach(() => {
  jest.useFakeTimers();
  mockFetchProducts.mockReset();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  jest.useRealTimers();
});

test('shows a spinner until the first ten products load', async () => {
  const request = nextRequest();
  const root = await renderScreen();

  expect(mockFetchProducts).toHaveBeenCalledWith(10);
  expect(root.findAllByType(ActivityIndicator)).toHaveLength(1);

  await act(async () => request.resolve(makeProducts(1, 10)));

  expect(root.findAllByType(ActivityIndicator)).toHaveLength(0);
  expect(hasText(root, 'Product 1')).toBe(true);
  expect(hasText(root, '$1.50')).toBe(true);
  expect(hasText(root, 'Product 10')).toBe(true);
});

test('offers a retry after a failed load', async () => {
  const failed = nextRequest();
  const root = await renderScreen();
  await act(async () => failed.reject(new Error('Network down')));

  expect(hasText(root, 'Couldn’t load the products.')).toBe(true);

  const retried = nextRequest();
  await act(async () => {
    findButton(root, 'Try again').props.onPress();
  });
  await act(async () => retried.resolve(makeProducts(1, 10)));

  expect(hasText(root, 'Product 1')).toBe(true);
});

test('says when there are no products', async () => {
  const request = nextRequest();
  const root = await renderScreen();
  await act(async () => request.resolve([]));

  expect(hasText(root, 'No products yet.')).toBe(true);
});

test('keeps the list while pulling to refresh', async () => {
  const root = await renderLoadedScreen();

  const refreshed = nextRequest();
  await act(async () => {
    root.findByType(RefreshControl).props.onRefresh();
  });

  expect(root.findByType(RefreshControl).props.refreshing).toBe(true);
  expect(hasText(root, 'Product 1')).toBe(true);

  await act(async () =>
    refreshed.resolve(makeProducts(1, 10).map(p => ({ ...p, price: 2 }))),
  );

  expect(root.findByType(RefreshControl).props.refreshing).toBe(false);
  expect(hasText(root, '$2.00')).toBe(true);
});

test('loads ten more products at the end of the list', async () => {
  const root = await renderLoadedScreen();

  const more = nextRequest();
  await reachEnd(root);

  expect(mockFetchProducts).toHaveBeenLastCalledWith(20);
  expect(root.findAllByType(ActivityIndicator)).toHaveLength(1);

  await act(async () => more.resolve(makeProducts(1, 20)));

  expect(root.findAllByType(ActivityIndicator)).toHaveLength(0);
  // Rows past the first screenful only mount after a real layout, so check
  // what the list was given rather than what it has drawn.
  const listed: Product[] = root.findByType(FlatList).props.data;
  expect(listed.map(product => product.id)).toEqual(
    makeProducts(1, 20).map(product => product.id),
  );
});

test('keeps the rows and offers a retry when a page fails', async () => {
  const root = await renderLoadedScreen();

  const failed = nextRequest();
  await reachEnd(root);
  await act(async () => failed.reject(new Error('Network down')));

  expect(hasText(root, 'Couldn’t load more products.')).toBe(true);
  expect(hasText(root, 'Product 1')).toBe(true);

  const retried = nextRequest();
  await act(async () => {
    findButton(root, 'Try again').props.onPress();
  });

  expect(mockFetchProducts).toHaveBeenLastCalledWith(20);

  await act(async () => retried.resolve(makeProducts(1, 20)));

  expect(hasText(root, 'Couldn’t load more products.')).toBe(false);
});

test('shows favorites above the list and marks their rows', async () => {
  const root = await renderLoadedScreen({
    initialFavoriteIds: ['product:2', '3'],
  });

  const favorite = findRows(root, 'Product 2');
  expect(favorite).toHaveLength(2);
  expect(favorite.every(hasFavoriteMark)).toBe(true);

  // '3' is a Home placeholder, not product 3.
  const other = findRows(root, 'Product 3');
  expect(other).toHaveLength(1);
  expect(hasFavoriteMark(other[0])).toBe(false);
});

test('invites the user to favorite something when there is nothing yet', async () => {
  const root = await renderLoadedScreen();

  expect(
    hasText(root, 'Tap “Add to favorites” on a product to keep it here.'),
  ).toBe(true);
});

test('titles the product rows as hot deals', async () => {
  const root = await renderLoadedScreen();

  const headers = root
    .findAll(
      node =>
        node.props.accessibilityRole === 'header' &&
        typeof node.type === 'string',
    )
    .map(node => node.props.accessibilityLabel ?? node.props.children);
  expect(headers).toContain('Hot deals');
});

test('titles the hot deals in the active language', async () => {
  const root = await renderLoadedScreen({ language: 'th' });

  expect(hasText(root, 'ดีลเด็ด')).toBe(true);
});

test('opens a product when its row is pressed', async () => {
  const root = await renderLoadedScreen();

  await act(async () => {
    findRows(root, 'Product 4')[0].props.onPress();
    jest.runOnlyPendingTimers();
  });

  expect(hasText(root, 'Opened product 4')).toBe(true);
});
