import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, Modal, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import type { RootStackParamList } from '@/navigation';
import { fetchProduct, fetchProducts } from '../../services/productsService';
import {
  makeProduct,
  makeProducts,
  renderWithProviders,
  type RenderOptions,
} from '../../testUtils';
import { ProductDetailScreen } from '../ProductDetailScreen';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);
const mockFetchProduct = jest.mocked(fetchProduct);

const Stack = createNativeStackNavigator<RootStackParamList>();

function OpenedCart() {
  return <Text>Opened cart</Text>;
}

let renderer: Renderer | undefined;

async function renderDetail(id: number, options?: RenderOptions) {
  renderer = await renderWithProviders(
    <Stack.Navigator>
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        initialParams={{ id }}
      />
      <Stack.Screen name="Cart" component={OpenedCart} />
    </Stack.Navigator>,
    options,
  );
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

/** The heart on the image has no text, only an accessibility label. */
function findLabelled(root: ReactTestInstance, label: string) {
  return root.find(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  );
}

function hasLabel(root: ReactTestInstance, label: string) {
  return (
    root.findAll(node => node.props.accessibilityLabel === label).length > 0
  );
}

function findButton(root: ReactTestInstance, label: string) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAllByType(Text).some(text => text.props.children === label),
  );
}

beforeEach(() => {
  mockFetchProducts.mockReset();
  mockFetchProduct.mockReset();
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('shows everything about a listed product', async () => {
  mockFetchProducts.mockResolvedValue([
    makeProduct(3, {
      title: 'Mens Cotton Jacket',
      price: 55.99,
      description: 'Great outerwear jackets.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/jacket.png',
      rating: { rate: 4.7, count: 500 },
    }),
  ]);

  const root = await renderDetail(3);

  expect(root.findAllByType(Image)[0].props.source).toEqual({
    uri: 'https://fakestoreapi.com/img/jacket.png',
  });
  expect(texts(root)).toEqual([
    "men's clothing",
    'Mens Cotton Jacket',
    '4.7 (500)',
    '$55.99',
    'Great outerwear jackets.',
    'Add to cart',
  ]);
  expect(mockFetchProduct).not.toHaveBeenCalled();
});

test('opens the image full screen and closes it again', async () => {
  const root = await renderDetail(3);

  const viewer = () => root.findAllByType(Modal)[0];
  expect(viewer().props.visible).toBe(false);

  await act(async () => {
    findLabelled(root, 'View larger image').props.onPress();
  });

  expect(viewer().props.visible).toBe(true);

  await act(async () => {
    findLabelled(root, 'Close').props.onPress();
  });

  expect(viewer().props.visible).toBe(false);
});

test('adds the product to the cart, then offers to view it', async () => {
  const root = await renderDetail(3);

  await act(async () => {
    findButton(root, 'Add to cart').props.onPress();
  });

  expect(texts(root)).not.toContain('Add to cart');

  await act(async () => {
    findButton(root, 'In cart · View cart').props.onPress();
  });

  expect(texts(root)).toContain('Opened cart');
});

test('refuses to add to a full cart and says why', async () => {
  mockFetchProduct.mockResolvedValue(makeProduct(11));
  const ten = Array.from({ length: 10 }, (_, index) => index + 1);
  const root = await renderDetail(11, { initialCartIds: ten });

  await act(async () => {
    findButton(root, 'Add to cart').props.onPress();
  });

  expect(texts(root)).toContain('Your cart is full');
  expect(texts(root)).toContain('Add to cart');

  await act(async () => {
    findButton(root, 'Got it').props.onPress();
  });

  expect(texts(root)).not.toContain('Your cart is full');
});

test('offers to view the cart when the product is already in it', async () => {
  const root = await renderDetail(3, { initialCartIds: [3] });

  expect(texts(root)).toContain('In cart · View cart');
  expect(texts(root)).not.toContain('Add to cart');
});

test('toggles the product as a favorite, apart from Home item 3', async () => {
  const root = await renderDetail(3, { initialFavoriteIds: ['3'] });

  await act(async () => {
    findLabelled(root, 'Add to favorites').props.onPress();
  });

  expect(hasLabel(root, 'Remove from favorites')).toBe(true);

  await act(async () => {
    findLabelled(root, 'Remove from favorites').props.onPress();
  });

  expect(hasLabel(root, 'Add to favorites')).toBe(true);
});

describe('with five favorites already', () => {
  const FULL = [
    'product:1',
    'product:2',
    'product:3',
    'product:4',
    'product:5',
  ];
  test('refuses a sixth and says why', async () => {
    const root = await renderDetail(6, { initialFavoriteIds: FULL });

    await act(async () => {
      findLabelled(root, 'Add to favorites').props.onPress();
    });

    expect(texts(root)).toContain('Favorites are full');
    expect(hasLabel(root, 'Add to favorites')).toBe(true);

    await act(async () => {
      findButton(root, 'Got it').props.onPress();
    });

    expect(texts(root)).not.toContain('Favorites are full');
  });

  test('still removes one of them', async () => {
    const root = await renderDetail(3, { initialFavoriteIds: FULL });

    await act(async () => {
      findLabelled(root, 'Remove from favorites').props.onPress();
    });

    expect(texts(root)).not.toContain('Favorites are full');
    expect(hasLabel(root, 'Add to favorites')).toBe(true);
  });
});

test('starts as a favorite when it already is one', async () => {
  const root = await renderDetail(3, { initialFavoriteIds: ['product:3'] });

  expect(hasLabel(root, 'Remove from favorites')).toBe(true);
});

test('fetches a product that is not in the loaded list', async () => {
  mockFetchProduct.mockResolvedValue(makeProduct(15));

  const root = await renderDetail(15);

  expect(mockFetchProduct).toHaveBeenCalledWith(15);
  expect(texts(root)).toContain('Product 15');
});

test('shows a labelled spinner while loading', async () => {
  mockFetchProducts.mockReturnValue(new Promise(() => {}));

  const root = await renderDetail(3);

  expect(root.findByType(ActivityIndicator).props.accessibilityLabel).toBe(
    'Loading the product',
  );
});

test('offers a retry when the product fails to load', async () => {
  mockFetchProduct.mockRejectedValueOnce(new Error('Network down'));
  mockFetchProduct.mockResolvedValueOnce(makeProduct(15));

  const root = await renderDetail(15);

  expect(texts(root)).toContain('Couldn’t load this product.');

  await act(async () => {
    findButton(root, 'Try again').props.onPress();
  });

  expect(texts(root)).toContain('Product 15');
});

test('says when the product does not exist', async () => {
  mockFetchProduct.mockResolvedValue(null);

  const root = await renderDetail(99);

  expect(texts(root)).toEqual(['This product doesn’t exist any more.']);
});

test('uses the active language', async () => {
  const root = await renderDetail(3, { language: 'th' });

  expect(texts(root)).toContain('US$3.50');
  expect(
    root.findAll(
      node => node.props.accessibilityLabel === 'คะแนน 4.1 จาก 5 · 30 รีวิว',
    ),
  ).not.toHaveLength(0);
});
