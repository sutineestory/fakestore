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
  isFavorite?: boolean;
  onPress?: (id: number) => void;
  language?: Language;
};

async function renderItem({
  isFavorite = false,
  onPress = jest.fn(),
  language,
}: RenderOptions = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <ProductListItem
            product={PRODUCT}
            isFavorite={isFavorite}
            onPress={onPress}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function textsOf(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function hasFavoriteMark(root: ReactTestInstance) {
  return (
    root.findAll(node => node.props.accessibilityLabel === 'Favorite').length >
    0
  );
}

test('shows the image, title and price', async () => {
  const root = await renderItem();

  expect(root.findByType(Image).props.source).toEqual({
    uri: 'https://fakestoreapi.com/img/backpack.png',
  });
  expect(textsOf(root)).toEqual(['Fjallraven Foldsack Backpack', '$109.95']);
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

test('marks a favorite with a heart', async () => {
  expect(hasFavoriteMark(await renderItem({ isFavorite: true }))).toBe(true);
  expect(hasFavoriteMark(await renderItem({ isFavorite: false }))).toBe(false);
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
