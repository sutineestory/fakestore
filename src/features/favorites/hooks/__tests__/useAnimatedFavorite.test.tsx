import { Animated } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { FavoritesProvider } from '../../FavoritesProvider';
import { useAnimatedFavorite } from '../useAnimatedFavorite';

const { act } = ReactTestRenderer;

type AnimatedFavorite = ReturnType<typeof useAnimatedFavorite>;

async function renderAnimatedFavorite(initialFavoriteIds?: string[]) {
  let favorite!: AnimatedFavorite;
  function Probe() {
    favorite = useAnimatedFavorite('1');
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
        <Probe />
      </FavoritesProvider>,
    );
  });

  return {
    get: () => favorite,
    async press() {
      await act(async () => favorite.press());
    },
  };
}

let spring: jest.SpyInstance;

beforeEach(() => {
  jest.useFakeTimers();
  spring = jest.spyOn(Animated, 'spring');
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  spring.mockRestore();
});

test('adds the item and pops the heart', async () => {
  const favorite = await renderAnimatedFavorite();

  await favorite.press();

  expect(favorite.get().isFavorite).toBe(true);
  expect(spring).toHaveBeenCalledWith(
    favorite.get().scale,
    expect.objectContaining({ toValue: 1 }),
  );
});

test('removes the item without a pop', async () => {
  const favorite = await renderAnimatedFavorite(['1']);

  await favorite.press();

  expect(favorite.get().isFavorite).toBe(false);
  expect(spring).not.toHaveBeenCalled();
});
