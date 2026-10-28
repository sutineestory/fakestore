import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, Text } from 'react-native';
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

let renderer: Renderer | undefined;

async function renderDetail(id: number, options?: RenderOptions) {
  renderer = await renderWithProviders(
    <Stack.Navigator>
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        initialParams={{ id }}
      />
    </Stack.Navigator>,
    options,
  );
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
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

  expect(root.findByType(Image).props.source).toEqual({
    uri: 'https://fakestoreapi.com/img/jacket.png',
  });
  expect(texts(root)).toEqual([
    "men's clothing",
    'Mens Cotton Jacket',
    '4.7 (500)',
    '$55.99',
    'Great outerwear jackets.',
    'Add to favorites',
    'Add to cart',
  ]);
  expect(mockFetchProduct).not.toHaveBeenCalled();
});

test('offers an add-to-cart button that does nothing yet', async () => {
  const root = await renderDetail(3);

  const addToCart = root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.type !== 'string' &&
      node
        .findAllByType(Text)
        .some(text => text.props.children === 'Add to cart'),
  );
  expect(addToCart.props.accessibilityState).toMatchObject({ disabled: false });
  expect(addToCart.props.onPress).toBeUndefined();
});

test('toggles the product as a favorite, apart from Home item 3', async () => {
  const root = await renderDetail(3, { initialFavoriteIds: ['3'] });

  await act(async () => {
    findButton(root, 'Add to favorites').props.onPress();
  });

  expect(texts(root)).toContain('Remove from favorites');

  await act(async () => {
    findButton(root, 'Remove from favorites').props.onPress();
  });

  expect(texts(root)).toContain('Add to favorites');
});

test('starts as a favorite when it already is one', async () => {
  const root = await renderDetail(3, { initialFavoriteIds: ['product:3'] });

  expect(texts(root)).toContain('Remove from favorites');
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
