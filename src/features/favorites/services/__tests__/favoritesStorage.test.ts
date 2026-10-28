import { createAsyncStorage } from '@react-native-async-storage/async-storage';

import { loadFavoriteIds, saveFavoriteIds } from '../favoritesStorage';

function saveRaw(value: string) {
  return createAsyncStorage('favorites').setItem('ids', value);
}

test('reads back what it saved, in order', async () => {
  await saveFavoriteIds(['product:3', '1', 'product:7']);

  await expect(loadFavoriteIds()).resolves.toEqual([
    'product:3',
    '1',
    'product:7',
  ]);
});

test('reads no favorites when nothing is saved', async () => {
  await expect(loadFavoriteIds()).resolves.toEqual([]);
});

test('reads no favorites from corrupt data', async () => {
  await saveRaw('{not json');

  await expect(loadFavoriteIds()).resolves.toEqual([]);
});

test('reads no favorites from data of the wrong shape', async () => {
  await saveRaw(JSON.stringify({ ids: ['1'] }));
  await expect(loadFavoriteIds()).resolves.toEqual([]);

  await saveRaw(JSON.stringify(['1', 2]));
  await expect(loadFavoriteIds()).resolves.toEqual([]);
});

test('saving replaces the previous list', async () => {
  await saveFavoriteIds(['1', '2']);
  await saveFavoriteIds(['2']);

  await expect(loadFavoriteIds()).resolves.toEqual(['2']);
});
