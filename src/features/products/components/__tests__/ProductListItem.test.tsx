import { Image, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { makeProduct } from '../../testUtils';
import { ProductListItem } from '../ProductListItem';

const { act } = ReactTestRenderer;

const PRODUCT = makeProduct(7, {
  title: 'Fjallraven Foldsack Backpack',
  price: 109.95,
  image: 'https://fakestoreapi.com/img/backpack.png',
});

type RenderOptions = {
  onPress?: (id: number) => void;
  language?: Language;
};

async function renderItem({
  onPress = jest.fn(),
  language,
}: RenderOptions = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <ProductListItem product={PRODUCT} onPress={onPress} />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function textsOf(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

test('shows the image, title and price', async () => {
  const root = await renderItem();

  expect(root.findByType(Image).props.source).toEqual({
    uri: 'https://fakestoreapi.com/img/backpack.png',
  });
  expect(textsOf(root)).toEqual([
    'Fjallraven Foldsack Backpack',
    '4.1 (70)',
    '$109.95',
  ]);
});

test('keeps long titles to two lines', async () => {
  const root = await renderItem();

  const title = root
    .findAllByType(Text)
    .find(text => text.props.children === PRODUCT.title);
  expect(title?.props.numberOfLines).toBe(2);
});

test('writes the price for the active language', async () => {
  const root = await renderItem({ language: 'th' });

  expect(textsOf(root)).toContain('US$109.95');
});

test('shows the rating as a number with its review count', async () => {
  const root = await renderItem();

  const rating = root.find(
    node =>
      node.props.accessible === true &&
      typeof node.props.accessibilityLabel === 'string' &&
      node.props.accessibilityLabel.startsWith('Rated'),
  );
  expect(rating.props.accessibilityLabel).toBe(
    'Rated 4.1 out of 5 · 70 reviews',
  );
  expect(textsOf(rating)).toEqual(['4.1 (70)']);
});

test('shows no heart; favorites are marked in the carousel', async () => {
  const root = await renderItem();

  expect(
    root.findAll(node => node.props.accessibilityLabel === 'Favorite'),
  ).toHaveLength(0);
});

test('is one button that reports its product id', async () => {
  const onPress = jest.fn();
  const root = await renderItem({ onPress });

  const buttons = root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  expect(buttons).toHaveLength(1);

  await act(async () => {
    buttons[0].props.onPress();
  });

  expect(onPress).toHaveBeenCalledWith(7);
});
