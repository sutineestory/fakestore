import { selectRecentFavoriteProductIds } from '../selectRecentFavoriteProductIds';

test('lists the most recently favorited product first', () => {
  const favoriteIds = new Set(['product:4', 'product:1', 'product:9']);

  expect(selectRecentFavoriteProductIds(favoriteIds, 10)).toEqual([9, 1, 4]);
});

test('skips favorites that are not products', () => {
  const favoriteIds = new Set(['2', 'product:5', '3']);

  expect(selectRecentFavoriteProductIds(favoriteIds, 10)).toEqual([5]);
});

test('keeps only the newest `limit` products', () => {
  const favoriteIds = new Set(
    Array.from({ length: 12 }, (_, index) => `product:${index + 1}`),
  );

  expect(selectRecentFavoriteProductIds(favoriteIds, 10)).toEqual([
    12, 11, 10, 9, 8, 7, 6, 5, 4, 3,
  ]);
});

test('is empty without favorites', () => {
  expect(selectRecentFavoriteProductIds(new Set(), 10)).toEqual([]);
});
