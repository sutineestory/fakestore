import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider } from '@/i18n';
import { lightTheme, ThemeProvider } from '@/theme';
import { FavoritesProvider } from '../../FavoritesProvider';
import { FavoriteIconButton } from '../FavoriteIconButton';

const { act } = ReactTestRenderer;

async function renderButton(initialFavoriteIds?: string[]) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <LanguageProvider>
          <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
            <FavoriteIconButton id="1" />
          </FavoritesProvider>
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function findButton(root: ReactTestInstance) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

function hasFilledHeart(root: ReactTestInstance) {
  return (
    root.findAll(node => node.props.fill === lightTheme.colors.favorite)
      .length > 0
  );
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('shows only a heart, labelled for screen readers', async () => {
  const root = await renderButton();

  expect(root.findAllByType(Text)).toHaveLength(0);
  expect(findButton(root).props.accessibilityLabel).toBe('Add to favorites');
  expect(hasFilledHeart(root)).toBe(false);
});

test('toggles the favorite and its label on each press', async () => {
  const root = await renderButton();

  await act(async () => {
    findButton(root).props.onPress();
  });

  expect(findButton(root).props.accessibilityLabel).toBe(
    'Remove from favorites',
  );
  expect(findButton(root).props.accessibilityState).toMatchObject({
    selected: true,
  });
  expect(hasFilledHeart(root)).toBe(true);

  await act(async () => {
    findButton(root).props.onPress();
  });

  expect(findButton(root).props.accessibilityLabel).toBe('Add to favorites');
});

test('starts filled for an existing favorite', async () => {
  const root = await renderButton(['1']);

  expect(hasFilledHeart(root)).toBe(true);
});
