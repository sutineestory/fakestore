import ReactTestRenderer from 'react-test-renderer';

import { ErrorBoundary } from '@/test-utils/ErrorBoundary';
import { FavoritesProvider, useFavorites } from '../FavoritesProvider';
import { loadFavoriteIds, saveFavoriteIds } from '../services/favoritesStorage';

const { act } = ReactTestRenderer;

type Favorites = ReturnType<typeof useFavorites>;

async function renderFavorites(initialFavoriteIds?: string[]) {
  let favorites!: Favorites;
  function Probe() {
    favorites = useFavorites();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
        <Probe />
      </FavoritesProvider>,
    );
  });

  return () => favorites;
}

async function toggle(getFavorites: () => Favorites, id: string) {
  await act(async () => {
    getFavorites().toggleFavorite(id);
  });
}

test('starts with no favorites', async () => {
  const getFavorites = await renderFavorites();

  expect(getFavorites().favoriteIds.size).toBe(0);
});

test('starts with the initial favorite ids', async () => {
  const getFavorites = await renderFavorites(['1', '3']);

  expect([...getFavorites().favoriteIds]).toEqual(['1', '3']);
});

test('toggleFavorite adds an id, then removes it', async () => {
  const getFavorites = await renderFavorites();

  await toggle(getFavorites, '2');
  expect(getFavorites().favoriteIds.has('2')).toBe(true);

  await toggle(getFavorites, '2');
  expect(getFavorites().favoriteIds.has('2')).toBe(false);
});

test('toggleFavorite leaves other ids untouched', async () => {
  const getFavorites = await renderFavorites(['1', '3']);

  await toggle(getFavorites, '1');

  expect([...getFavorites().favoriteIds]).toEqual(['3']);
});

test('restores the favorites of an earlier session', async () => {
  await saveFavoriteIds(['product:2', '1']);

  const getFavorites = await renderFavorites();

  expect([...getFavorites().favoriteIds]).toEqual(['product:2', '1']);
});

test('saves toggles for the next session', async () => {
  const getFavorites = await renderFavorites();

  await toggle(getFavorites, 'product:5');
  await toggle(getFavorites, '2');
  await toggle(getFavorites, 'product:5');

  await expect(loadFavoriteIds()).resolves.toEqual(['2']);
});

test('useFavorites throws outside <FavoritesProvider>', async () => {
  // React logs errors caught by a boundary; keep the test output clean.
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  const onError = jest.fn();
  function Probe() {
    useFavorites();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <ErrorBoundary onError={onError}>
        <Probe />
      </ErrorBoundary>,
    );
  });

  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({
      message: 'useFavorites must be used inside <FavoritesProvider>.',
    }),
  );

  consoleError.mockRestore();
});
