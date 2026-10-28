import ReactTestRenderer from 'react-test-renderer';

import { FavoritesProvider } from '@/features/favorites';
import { useFavoriteProductLimit } from '../useFavoriteProductLimit';

const { act } = ReactTestRenderer;

type Limit = ReturnType<typeof useFavoriteProductLimit>;

async function renderLimit(initialFavoriteIds: string[]) {
  let limit!: Limit;
  function Probe() {
    limit = useFavoriteProductLimit();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
        <Probe />
      </FavoritesProvider>,
    );
  });

  return () => limit;
}

const FIVE = ['product:1', 'product:2', 'product:3', 'product:4', 'product:5'];

test('allows adding while there is room', async () => {
  const getLimit = await renderLimit(FIVE.slice(0, 4));

  let allowed!: boolean;
  await act(async () => {
    allowed = getLimit().beforeAdd();
  });

  expect(allowed).toBe(true);
  expect(getLimit().limitReached).toBe(false);
});

test('refuses once five products are favorites and flags it', async () => {
  const getLimit = await renderLimit(FIVE);

  let allowed!: boolean;
  await act(async () => {
    allowed = getLimit().beforeAdd();
  });

  expect(allowed).toBe(false);
  expect(getLimit().limitReached).toBe(true);

  await act(async () => getLimit().dismissLimit());

  expect(getLimit().limitReached).toBe(false);
});

test('does not count Home items toward the limit', async () => {
  const getLimit = await renderLimit([...FIVE.slice(0, 4), '1', '2']);

  let allowed!: boolean;
  await act(async () => {
    allowed = getLimit().beforeAdd();
  });

  expect(allowed).toBe(true);
});
