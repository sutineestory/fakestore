import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import {
  loadFavoriteIds,
  saveFavoriteIds,
} from '../../services/favoritesStorage';
import { usePersistedFavoriteIds } from '../usePersistedFavoriteIds';

jest.mock('../../services/favoritesStorage');

const { act } = ReactTestRenderer;

const mockLoadFavoriteIds = jest.mocked(loadFavoriteIds);
const mockSaveFavoriteIds = jest.mocked(saveFavoriteIds);

type Persisted = ReturnType<typeof usePersistedFavoriteIds>;

let renderer: Renderer | undefined;

async function renderPersisted(initialFavoriteIds?: string[]) {
  let persisted!: Persisted;
  function Probe() {
    persisted = usePersistedFavoriteIds(initialFavoriteIds);
    return null;
  }

  await act(async () => {
    renderer = ReactTestRenderer.create(<Probe />);
  });

  return {
    ids: () => [...persisted[0]],
    async add(id: string) {
      await act(async () => {
        persisted[1](current => new Set([...current, id]));
      });
    },
  };
}

/** Makes the next read wait until the test settles it. */
function nextRead() {
  const read = Promise.withResolvers<string[]>();
  mockLoadFavoriteIds.mockReturnValueOnce(read.promise);
  return read;
}

beforeEach(() => {
  mockLoadFavoriteIds.mockReset();
  mockSaveFavoriteIds.mockReset();
  mockLoadFavoriteIds.mockResolvedValue([]);
  mockSaveFavoriteIds.mockResolvedValue();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('restores the saved favorites', async () => {
  mockLoadFavoriteIds.mockResolvedValue(['product:2', '1']);

  const { ids } = await renderPersisted();

  expect(ids()).toEqual(['product:2', '1']);
});

test('keeps favorites added while the read was in flight, newest last', async () => {
  const read = nextRead();
  const { ids, add } = await renderPersisted();

  await add('product:9');
  await act(async () => read.resolve(['product:2']));

  expect(ids()).toEqual(['product:2', 'product:9']);
});

test('writes nothing until the saved favorites are read', async () => {
  const read = nextRead();
  const { add } = await renderPersisted();

  await add('product:9');

  expect(mockSaveFavoriteIds).not.toHaveBeenCalled();

  await act(async () => read.resolve(['product:2']));

  expect(mockSaveFavoriteIds).toHaveBeenLastCalledWith([
    'product:2',
    'product:9',
  ]);
});

test('saves every change after that', async () => {
  const { add } = await renderPersisted(['1']);

  await add('product:4');

  expect(mockSaveFavoriteIds).toHaveBeenLastCalledWith(['1', 'product:4']);
});

test('never writes over storage it could not read', async () => {
  mockLoadFavoriteIds.mockRejectedValue(new Error('Disk unavailable'));

  const { ids, add } = await renderPersisted();
  await add('product:4');

  expect(ids()).toEqual(['product:4']);
  expect(mockSaveFavoriteIds).not.toHaveBeenCalled();
});

test('keeps working when a save fails', async () => {
  mockSaveFavoriteIds.mockRejectedValueOnce(new Error('Disk full'));
  const { ids, add } = await renderPersisted();

  await add('product:4');
  await add('product:5');

  expect(ids()).toEqual(['product:4', 'product:5']);
  expect(mockSaveFavoriteIds).toHaveBeenLastCalledWith([
    'product:4',
    'product:5',
  ]);
});

test('ignores a read that finishes after unmounting', async () => {
  const read = nextRead();
  await renderPersisted();

  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  await act(async () => read.resolve(['product:2']));

  expect(mockSaveFavoriteIds).not.toHaveBeenCalled();
});
