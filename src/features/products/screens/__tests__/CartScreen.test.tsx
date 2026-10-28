import { FlatList, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { fetchProduct, fetchProducts } from '../../services/productsService';
import {
  makeProduct,
  makeProducts,
  renderProductsScreen,
  type RenderOptions,
} from '../../testUtils';
import { CartScreen } from '../CartScreen';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);
const mockFetchProduct = jest.mocked(fetchProduct);

let renderer: Renderer | undefined;

async function renderCart(options?: RenderOptions) {
  renderer = await renderProductsScreen(CartScreen, options);
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function findLabelled(root: ReactTestInstance, label: string) {
  return root.find(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  );
}

function findButton(root: ReactTestInstance, title: string) {
  return root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      node.findAllByType(Text).some(text => text.props.children === title),
  )[0];
}

function listed(root: ReactTestInstance) {
  return root
    .findByType(FlatList)
    .props.data.map((product: { id: number }) => product.id);
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

test('says when the cart is empty and cannot be submitted', async () => {
  const root = await renderCart();

  expect(texts(root)).toContain('Your cart is empty.');
  expect(texts(root)).not.toContain('Remove all');
  expect(
    findButton(root, 'Submit order').props.accessibilityState,
  ).toMatchObject({ disabled: true });
});

test('shows a placeholder row per cart item while they load', async () => {
  mockFetchProducts.mockReturnValue(new Promise(() => {}));

  const root = await renderCart({ initialCartIds: [2, 4, 15] });

  const [skeleton] = root.findAll(
    node =>
      typeof node.type === 'string' &&
      node.props.accessibilityRole === 'progressbar',
  );
  expect(skeleton.props.accessibilityLabel).toBe('Loading your cart');
  expect(listed(root)).toEqual([]);
});

test('lists the cart like the product list, with a count and total', async () => {
  const root = await renderCart({ initialCartIds: [2, 4] });

  expect(listed(root)).toEqual([2, 4]);
  expect(texts(root)).toEqual(
    expect.arrayContaining(['2 items', 'Product 2', 'Product 4', '$7.00']),
  );
});

test('removes one product at a time', async () => {
  const root = await renderCart({ initialCartIds: [2, 4] });

  await act(async () => {
    findLabelled(root, 'Remove Product 2 from the cart').props.onPress();
  });

  expect(listed(root)).toEqual([4]);
  expect(texts(root)).toEqual(expect.arrayContaining(['1 item', '$4.50']));
});

test('removes everything at once', async () => {
  const root = await renderCart({ initialCartIds: [2, 4] });

  await act(async () => {
    findButton(root, 'Remove all').props.onPress();
  });

  expect(listed(root)).toEqual([]);
  expect(texts(root)).toContain('Your cart is empty.');
  expect(texts(root)).toContain('$0.00');
});

test('fetches products the list has not loaded', async () => {
  const root = await renderCart({ initialCartIds: [15] });

  expect(mockFetchProduct).toHaveBeenCalledWith(15);
  expect(listed(root)).toEqual([15]);
});

test('offers a submit button that does nothing yet', async () => {
  const root = await renderCart({ initialCartIds: [2] });

  const submit = findButton(root, 'Submit order');
  expect(submit.props.accessibilityState).toMatchObject({ disabled: false });
  expect(submit.props.onPress).toBeUndefined();
});

test('opens a product from its row', async () => {
  const root = await renderCart({ initialCartIds: [2] });

  const row = root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node
        .findAllByType(Text)
        .some(text => text.props.children === 'Product 2'),
  )[0];
  await act(async () => {
    row.props.onPress();
    jest.runOnlyPendingTimers();
  });

  expect(texts(root)).toContain('Opened product 2');
});
