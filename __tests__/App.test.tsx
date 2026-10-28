/**
 * @format
 */

import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import App from '@/App';
import { makeProducts } from '@/features/products/testUtils';

const { act } = ReactTestRenderer;

const PRODUCTS = makeProducts(1, 20);

/** Answers like the Fake Store API: `?limit=N` lists, `/products/:id` gets one. */
function fakeStoreResponse(url: string) {
  const { pathname, searchParams } = new URL(url);
  const id = pathname.match(/^\/products\/(\d+)$/)?.[1];
  const body = id
    ? PRODUCTS.find(product => product.id === Number(id))
    : PRODUCTS.slice(0, Number(searchParams.get('limit')));
  return new Response(body ? JSON.stringify(body) : '');
}

const mockFetch = jest.spyOn(globalThis, 'fetch');

function hasText(node: ReactTestInstance, text: string) {
  return (
    node.findAll(
      child => typeof child.type === 'string' && child.props.children === text,
    ).length > 0
  );
}

function hasFavoriteStar(node: ReactTestInstance) {
  return (
    node.findAll(child => child.props.accessibilityLabel === 'Favorite')
      .length > 0
  );
}

function findButton(root: ReactTestInstance, text: string) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      hasText(node, text),
  );
}

function findLabelled(root: ReactTestInstance, label: string) {
  return root.find(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  );
}

function findTab(root: ReactTestInstance, label: string) {
  // Tab items nest several pressables; the outermost one handles the press.
  const [tab] = root.findAll(
    node =>
      node.props.role === 'button' &&
      typeof node.props.onPress === 'function' &&
      hasText(node, label),
  );
  return tab;
}

async function renderApp() {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    jest.runOnlyPendingTimers();
  });
  return renderer;
}

async function press(node: ReactTestInstance) {
  await act(async () => {
    node.props.onPress();
    jest.runOnlyPendingTimers();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  mockFetch.mockImplementation(async input => fakeStoreResponse(String(input)));
});

afterEach(() => {
  jest.useRealTimers();
});

test('renders the Home tab and navigates to Details', async () => {
  const renderer = await renderApp();

  expect(hasText(renderer.root, 'Welcome')).toBe(true);

  await press(findButton(renderer.root, 'Design system'));

  expect(hasText(renderer.root, 'Item #2')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});

test('opens the sample list from Home', async () => {
  const renderer = await renderApp();

  await press(findButton(renderer.root, 'Open sample list'));
  // The list fetches on mount, so its mock latency starts after the push.
  await act(async () => {
    jest.runOnlyPendingTimers();
  });

  expect(
    hasText(renderer.root, 'Loaded from a mock service. Pull down to refresh.'),
  ).toBe(true);
  expect(hasText(renderer.root, 'Sample item 1')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});

test('switches to the Products tab', async () => {
  const renderer = await renderApp();

  expect(findTab(renderer.root, 'Products').props['aria-selected']).toBe(false);

  await press(findTab(renderer.root, 'Products'));

  expect(findTab(renderer.root, 'Products').props['aria-selected']).toBe(true);
  expect(findTab(renderer.root, 'Home').props['aria-selected']).toBe(false);

  await act(async () => {
    renderer.unmount();
  });
});

test('lists products from the store on the Products tab', async () => {
  const renderer = await renderApp();

  await press(findTab(renderer.root, 'Products'));

  expect(mockFetch).toHaveBeenCalledWith(
    'https://fakestoreapi.com/products?limit=10',
    expect.anything(),
  );
  expect(hasText(renderer.root, 'Product 1')).toBe(true);
  expect(hasText(renderer.root, '$1.50')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});

test('shows a cart button in the Products and detail headers', async () => {
  const renderer = await renderApp();
  const cartButtons = () =>
    renderer.root.findAll(
      node =>
        node.props.accessibilityLabel === 'Cart' &&
        node.props.accessibilityRole === 'button' &&
        typeof node.type === 'string',
    );

  expect(cartButtons()).toHaveLength(0);

  await press(findTab(renderer.root, 'Products'));

  expect(cartButtons()).toHaveLength(1);

  await press(findButton(renderer.root, 'Product 2'));

  // The detail header adds its own; the tab header stays mounted beneath.
  expect(cartButtons()).toHaveLength(2);

  await act(async () => {
    renderer.unmount();
  });
});

test('adds a product to the cart and removes it there', async () => {
  const renderer = await renderApp();

  await press(findTab(renderer.root, 'Products'));
  await press(findButton(renderer.root, 'Product 2'));
  await press(findButton(renderer.root, 'Add to cart'));

  // The detail header's cart button is the one on top.
  const cartButtons = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === 'Cart, 1 item' &&
      typeof node.props.onPress === 'function',
  );
  await press(cartButtons[cartButtons.length - 1]);

  expect(hasText(renderer.root, '1 item')).toBe(true);
  expect(hasText(renderer.root, 'Submit order')).toBe(true);

  await press(findLabelled(renderer.root, 'Remove Product 2 from the cart'));

  expect(hasText(renderer.root, 'Your cart is empty.')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});

test('favorites a product from its detail screen', async () => {
  const renderer = await renderApp();

  await press(findTab(renderer.root, 'Products'));
  await press(findButton(renderer.root, 'Product 2'));

  expect(hasText(renderer.root, 'Description of product 2.')).toBe(true);

  await press(findLabelled(renderer.root, 'Add to favorites'));

  expect(findLabelled(renderer.root, 'Remove from favorites')).toBeTruthy();

  await act(async () => {
    renderer.unmount();
  });
});

test('keeps favorites after the app restarts', async () => {
  const first = await renderApp();
  await press(findTab(first.root, 'Products'));
  await press(findButton(first.root, 'Product 2'));
  await press(findLabelled(first.root, 'Add to favorites'));
  await act(async () => {
    first.unmount();
  });

  const second = await renderApp();
  await press(findTab(second.root, 'Products'));

  const favoriteCard = second.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      hasText(node, 'Product 2'),
  );
  // Its card in the carousel, plus its row in the list.
  expect(favoriteCard).toHaveLength(2);

  await act(async () => {
    second.unmount();
  });
});

test('stars an item on Home once it is favorited on Details', async () => {
  const renderer = await renderApp();

  expect(hasFavoriteStar(findButton(renderer.root, 'Navigation'))).toBe(false);

  await press(findButton(renderer.root, 'Navigation'));
  await press(findButton(renderer.root, 'Add to favorites'));
  await press(findButton(renderer.root, 'Go back'));

  expect(hasFavoriteStar(findButton(renderer.root, 'Navigation'))).toBe(true);
  expect(hasFavoriteStar(findButton(renderer.root, 'Design system'))).toBe(
    false,
  );

  await act(async () => {
    renderer.unmount();
  });
});

test('switches the whole app to Thai from Settings', async () => {
  const renderer = await renderApp();

  await press(findButton(renderer.root, 'Getting started'));
  await press(findButton(renderer.root, 'Open Settings'));
  await press(findButton(renderer.root, 'ไทย'));

  expect(hasText(renderer.root, 'ภาษา')).toBe(true);
  expect(hasText(renderer.root, 'Language')).toBe(false);

  await press(findTab(renderer.root, 'หน้าแรก'));

  expect(hasText(renderer.root, 'ยินดีต้อนรับ')).toBe(true);

  await press(findButton(renderer.root, 'ระบบดีไซน์'));

  expect(hasText(renderer.root, 'รายการที่ 2')).toBe(true);
  expect(hasText(renderer.root, 'เพิ่มในรายการโปรด')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});
