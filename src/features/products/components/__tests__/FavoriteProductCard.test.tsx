import { Image, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { makeProduct } from '../../testUtils';
import { FavoriteProductCard } from '../FavoriteProductCard';

const { act } = ReactTestRenderer;

const PRODUCT = makeProduct(5, {
  title: 'Solid Gold Petite Micropave',
  price: 168,
  image: 'https://fakestoreapi.com/img/ring.png',
});

async function renderCard(onPress: (id: number) => void = jest.fn()) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider>
          <FavoriteProductCard
            product={PRODUCT}
            width={120}
            onPress={onPress}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

test('shows the image, a one-line title, the price and a heart', async () => {
  const root = await renderCard();

  expect(root.findByType(Image).props.source).toEqual({
    uri: 'https://fakestoreapi.com/img/ring.png',
  });
  const texts = root.findAllByType(Text);
  expect(texts.map(text => text.props.children)).toEqual([
    'Solid Gold Petite Micropave',
    '$168.00',
  ]);
  expect(texts[0].props.numberOfLines).toBe(1);
  expect(
    root.findAll(node => node.props.accessibilityLabel === 'Favorite'),
  ).not.toHaveLength(0);
});

test('is one button that reports its product id', async () => {
  const onPress = jest.fn();
  const root = await renderCard(onPress);

  const buttons = root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  expect(buttons).toHaveLength(1);

  await act(async () => {
    buttons[0].props.onPress();
  });

  expect(onPress).toHaveBeenCalledWith(5);
});
