import { createAsyncStorage } from '@react-native-async-storage/async-storage';

import { loadCartIds, saveCartIds } from '../cartStorage';

function saveRaw(value: string) {
  return createAsyncStorage('cart').setItem('ids', value);
}

test('reads back what it saved, in order', async () => {
  await saveCartIds([4, 1, 9]);

  await expect(loadCartIds()).resolves.toEqual([4, 1, 9]);
});

test('reads an empty cart when nothing is saved', async () => {
  await expect(loadCartIds()).resolves.toEqual([]);
});

test('reads an empty cart from corrupt data', async () => {
  await saveRaw('{not json');

  await expect(loadCartIds()).resolves.toEqual([]);
});

test('reads an empty cart from data of the wrong shape', async () => {
  await saveRaw(JSON.stringify({ ids: [1] }));
  await expect(loadCartIds()).resolves.toEqual([]);

  await saveRaw(JSON.stringify([1, '2']));
  await expect(loadCartIds()).resolves.toEqual([]);

  await saveRaw(JSON.stringify([1.5]));
  await expect(loadCartIds()).resolves.toEqual([]);
});
