import { countFavoriteProducts, MAX_FAVORITE_PRODUCTS } from '../favoriteLimit';

test('allows five favorite products', () => {
  expect(MAX_FAVORITE_PRODUCTS).toBe(5);
});

test('counts only product favorites', () => {
  const favoriteIds = new Set(['product:1', '2', 'product:7', '3']);

  expect(countFavoriteProducts(favoriteIds)).toBe(2);
});

test('is zero without favorites', () => {
  expect(countFavoriteProducts(new Set())).toBe(0);
});
