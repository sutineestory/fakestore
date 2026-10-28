import { productFavoriteId } from '../productFavoriteId';

test('keys a product by its id', () => {
  expect(productFavoriteId(15)).toBe('product:15');
});

test('never collides with the Home placeholder ids', () => {
  expect(['1', '2', '3', '4']).not.toContain(productFavoriteId(2));
});
