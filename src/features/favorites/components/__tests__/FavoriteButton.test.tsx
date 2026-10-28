import { Animated, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { lightTheme, ThemeProvider } from '@/theme';
import { FavoritesProvider } from '../../FavoritesProvider';
import { FavoriteButton } from '../FavoriteButton';

const { act } = ReactTestRenderer;

type RenderOptions = {
  initialFavoriteIds?: string[];
  language?: Language;
};

async function renderButtons(
  ids: string[],
  { initialFavoriteIds, language }: RenderOptions = {},
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <LanguageProvider initialLanguage={language}>
          <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
            {ids.map(id => (
              <FavoriteButton key={id} id={id} />
            ))}
          </FavoritesProvider>
        </LanguageProvider>
      </ThemeProvider>,
    );
  });

  return renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

function labelOf(button: ReactTestInstance) {
  return button.findByType(Text).props.children;
}

async function press(button: ReactTestInstance) {
  await act(async () => {
    button.props.onPress();
  });
}

function hasFilledHeart(button: ReactTestInstance) {
  return (
    button.findAll(node => node.props.fill === lightTheme.colors.favorite)
      .length > 0
  );
}

let spring: jest.SpyInstance;

// The pop animation finishes on a timer.
beforeEach(() => {
  jest.useFakeTimers();
  spring = jest.spyOn(Animated, 'spring');
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  spring.mockRestore();
});

test('offers to add an item that is not a favorite', async () => {
  const [button] = await renderButtons(['1']);

  expect(labelOf(button)).toBe('Add to favorites');
});

test('offers to remove an item that is already a favorite', async () => {
  const [button] = await renderButtons(['1'], { initialFavoriteIds: ['1'] });

  expect(labelOf(button)).toBe('Remove from favorites');
});

test('toggles the favorite on each press', async () => {
  const [button] = await renderButtons(['1']);

  await press(button);
  expect(labelOf(button)).toBe('Remove from favorites');

  await press(button);
  expect(labelOf(button)).toBe('Add to favorites');
});

test('only toggles its own item', async () => {
  const [first, second] = await renderButtons(['1', '2']);

  await press(first);

  expect(labelOf(first)).toBe('Remove from favorites');
  expect(labelOf(second)).toBe('Add to favorites');
});

test('labels the button in the active language', async () => {
  const [add, remove] = await renderButtons(['1', '2'], {
    initialFavoriteIds: ['2'],
    language: 'th',
  });

  expect(labelOf(add)).toBe('เพิ่มในรายการโปรด');
  expect(labelOf(remove)).toBe('นำออกจากรายการโปรด');
});

test('fills the heart once the item is a favorite', async () => {
  const [button] = await renderButtons(['1']);

  expect(hasFilledHeart(button)).toBe(false);

  await press(button);

  expect(hasFilledHeart(button)).toBe(true);
});

test('pops the heart when adding, not when removing', async () => {
  const [button] = await renderButtons(['1']);

  await press(button);
  expect(spring).toHaveBeenCalledTimes(1);

  await press(button);
  expect(spring).toHaveBeenCalledTimes(1);
});

test('does not pop for an item that starts as a favorite', async () => {
  await renderButtons(['1'], { initialFavoriteIds: ['1'] });

  expect(spring).not.toHaveBeenCalled();
});
