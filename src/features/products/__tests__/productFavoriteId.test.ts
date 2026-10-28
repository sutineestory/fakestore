import {
  parseProductFavoriteId,
  productFavoriteId,
} from '../productFavoriteId';

test('keys a product by its id', () => {
  expect(productFavoriteId(15)).toBe('product:15');
});

test('never collides with the Home placeholder ids', () => {
  expect(['1', '2', '3', '4']).not.toContain(productFavoriteId(2));
});

test('reads the product id back from its key', () => {
  expect(parseProductFavoriteId(productFavoriteId(15))).toBe(15);
});

test('ignores keys that are not products', () => {
  expect(parseProductFavoriteId('2')).toBeNull();
  expect(parseProductFavoriteId('product:')).toBeNull();
  expect(parseProductFavoriteId('product:abc')).toBeNull();
  expect(parseProductFavoriteId('product:1.5')).toBeNull();
});
