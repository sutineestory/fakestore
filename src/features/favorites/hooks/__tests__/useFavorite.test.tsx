import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ErrorBoundary } from '@/test-utils/ErrorBoundary';
import { FavoritesProvider, useFavorites } from '../../FavoritesProvider';
import { useFavorite } from '../useFavorite';

const { act } = ReactTestRenderer;

type Favorite = ReturnType<typeof useFavorite>;

async function renderFavorite(id: string, initialFavoriteIds?: string[]) {
  let favorite!: Favorite;
  let favoriteIds!: ReadonlySet<string>;
  function Probe({ itemId }: { itemId: string }) {
    favorite = useFavorite(itemId);
    favoriteIds = useFavorites().favoriteIds;
    return null;
  }

  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
        <Probe itemId={id} />
      </FavoritesProvider>,
    );
  });

  return {
    getFavorite: () => favorite,
    getFavoriteIds: () => favoriteIds,
    async toggle() {
      await act(async () => {
        favorite.toggle();
      });
    },
    async changeId(nextId: string) {
      await act(async () => {
        renderer.update(
          <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
            <Probe itemId={nextId} />
          </FavoritesProvider>,
        );
      });
    },
  };
}

test('is not a favorite when no favorites exist', async () => {
  const { getFavorite } = await renderFavorite('1');

  expect(getFavorite().isFavorite).toBe(false);
});

test('is a favorite when the id is in the initial favorites', async () => {
  const { getFavorite } = await renderFavorite('1', ['1']);

  expect(getFavorite().isFavorite).toBe(true);
});

test('toggle adds the item, then removes it', async () => {
  const { getFavorite, toggle } = await renderFavorite('1');

  await toggle();
  expect(getFavorite().isFavorite).toBe(true);

  await toggle();
  expect(getFavorite().isFavorite).toBe(false);
});

test('toggle leaves other favorites untouched', async () => {
  const { getFavoriteIds, toggle } = await renderFavorite('1', ['2', '3']);

  await toggle();

  expect([...getFavoriteIds()]).toEqual(['2', '3', '1']);
});

test('follows the new id when it changes', async () => {
  const { getFavorite, getFavoriteIds, changeId, toggle } =
    await renderFavorite('1', ['1']);

  await changeId('2');
  expect(getFavorite().isFavorite).toBe(false);

  await toggle();
  expect([...getFavoriteIds()]).toEqual(['1', '2']);
});

test('throws outside <FavoritesProvider>', async () => {
  // React logs errors caught by a boundary; keep the test output clean.
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  const onError = jest.fn();
  function Probe() {
    useFavorite('1');
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
