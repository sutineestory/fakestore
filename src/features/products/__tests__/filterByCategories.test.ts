import { filterByCategories } from '../filterByCategories';
import { makeProduct } from '../testUtils';
import type { Product } from '../types';

const PRODUCTS: Product[] = [
  makeProduct(1, { category: 'electronics' }),
  makeProduct(2, { category: 'jewelery' }),
  makeProduct(3, { category: "men's clothing" }),
  makeProduct(4, { category: 'electronics' }),
];

function idsOf(products: Product[]) {
  return products.map(product => product.id);
}

test('keeps every product when no category is chosen', () => {
  expect(filterByCategories(PRODUCTS, [])).toBe(PRODUCTS);
});

test('keeps the products of one category, in order', () => {
  expect(idsOf(filterByCategories(PRODUCTS, ['electronics']))).toEqual([1, 4]);
});

test('keeps the products of any chosen category', () => {
  expect(
    idsOf(filterByCategories(PRODUCTS, ["men's clothing", 'jewelery'])),
  ).toEqual([2, 3]);
});

test('matches the category exactly', () => {
  expect(filterByCategories(PRODUCTS, ['Electronics'])).toEqual([]);
});

test('returns nothing for no products', () => {
  expect(filterByCategories([], ['electronics'])).toEqual([]);
});
