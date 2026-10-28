import { ShoppingCartIcon } from 'lucide-react-native';
import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { Icon } from '@/components';
import { fetchProducts } from '../../services/productsService';
import { renderProductsScreen, type RenderOptions } from '../../testUtils';
import { CartButton } from '../CartButton';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

jest.mocked(fetchProducts).mockResolvedValue([]);

let renderer: Renderer | undefined;

async function renderCartButton(options?: RenderOptions) {
  renderer = await renderProductsScreen(CartButton, options);
  return renderer.root;
}

function findButton(root: ReactTestInstance) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('is a labelled cart icon with no badge while the cart is empty', async () => {
  const root = await renderCartButton();

  expect(findButton(root).props.accessibilityLabel).toBe('Cart');
  expect(root.findByType(Icon).props.icon).toBe(ShoppingCartIcon);
  expect(texts(root)).toEqual([]);
});

test('counts what is in the cart', async () => {
  const root = await renderCartButton({ initialCartIds: [1, 2] });

  expect(findButton(root).props.accessibilityLabel).toBe('Cart, 2 items');
  expect(texts(root)).toEqual([2]);
});

test('opens the cart', async () => {
  const root = await renderCartButton();

  await act(async () => {
    findButton(root).props.onPress();
  });

  expect(texts(root)).toContain('Opened cart');
});

test('uses the active language', async () => {
  const root = await renderCartButton({
    initialCartIds: [1],
    language: 'th',
  });

  expect(findButton(root).props.accessibilityLabel).toBe('ตะกร้า, 1 รายการ');
});
