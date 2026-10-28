import { Animated } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { FavoritesProvider } from '../../FavoritesProvider';
import { useAnimatedFavorite } from '../useAnimatedFavorite';

const { act } = ReactTestRenderer;

type AnimatedFavorite = ReturnType<typeof useAnimatedFavorite>;

async function renderAnimatedFavorite(
  initialFavoriteIds?: string[],
  beforeAdd?: () => boolean,
) {
  let favorite!: AnimatedFavorite;
  function Probe() {
    favorite = useAnimatedFavorite('1', beforeAdd);
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

test('does not add or pop when beforeAdd says no', async () => {
  const beforeAdd = jest.fn(() => false);
  const favorite = await renderAnimatedFavorite(undefined, beforeAdd);

  await favorite.press();

  expect(beforeAdd).toHaveBeenCalledTimes(1);
  expect(favorite.get().isFavorite).toBe(false);
  expect(spring).not.toHaveBeenCalled();
});

test('adds when beforeAdd allows it', async () => {
  const favorite = await renderAnimatedFavorite(undefined, () => true);

  await favorite.press();

  expect(favorite.get().isFavorite).toBe(true);
});

test('always lets a favorite be removed', async () => {
  const beforeAdd = jest.fn(() => false);
  const favorite = await renderAnimatedFavorite(['1'], beforeAdd);

  await favorite.press();

  expect(favorite.get().isFavorite).toBe(false);
  expect(beforeAdd).not.toHaveBeenCalled();
});
