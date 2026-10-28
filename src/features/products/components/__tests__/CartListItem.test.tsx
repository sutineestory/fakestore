import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { makeProduct } from '../../testUtils';
import { CartListItem } from '../CartListItem';

const { act } = ReactTestRenderer;

async function renderItem(onPress = jest.fn(), onRemove = jest.fn()) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider>
          <CartListItem
            product={makeProduct(4)}
            onPress={onPress}
            onRemove={onRemove}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function buttons(root: ReactTestInstance) {
  return root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

test('shows the product like a list row', async () => {
  const root = await renderItem();

  expect(root.findAllByType(Text).map(text => text.props.children)).toEqual([
    'Product 4',
    '4.1 (40)',
    '$4.50',
  ]);
});

test('opens the product and removes it from separate buttons', async () => {
  const onPress = jest.fn();
  const onRemove = jest.fn();
  const root = await renderItem(onPress, onRemove);

  const [row, remove] = buttons(root);
  expect(remove.props.accessibilityLabel).toBe(
    'Remove Product 4 from the cart',
  );

  await act(async () => {
    row.props.onPress();
  });
  expect(onPress).toHaveBeenCalledWith(4);
  expect(onRemove).not.toHaveBeenCalled();

  await act(async () => {
    remove.props.onPress();
  });
  expect(onRemove).toHaveBeenCalledWith(4);
});
