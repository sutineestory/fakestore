import { sortProducts } from '../sortProducts';
import { makeProduct } from '../testUtils';
import type { Product } from '../types';

const PRODUCTS: Product[] = [
  makeProduct(1, {
    title: 'banana',
    price: 20,
    rating: { rate: 4.5, count: 10 },
  }),
  makeProduct(2, {
    title: 'Apple',
    price: 5.5,
    rating: { rate: 3.1, count: 400 },
  }),
  makeProduct(3, {
    title: 'cherry',
    price: 120,
    rating: { rate: 4.5, count: 90 },
  }),
];

function idsOf(products: Product[]) {
  return products.map(product => product.id);
}

test('keeps the API order for recommended', () => {
  expect(sortProducts(PRODUCTS, 'recommended')).toBe(PRODUCTS);
});

test('puts the cheapest first', () => {
  expect(idsOf(sortProducts(PRODUCTS, 'priceLowToHigh'))).toEqual([2, 1, 3]);
});

test('puts the most expensive first', () => {
  expect(idsOf(sortProducts(PRODUCTS, 'priceHighToLow'))).toEqual([3, 1, 2]);
});

test('puts the best rated first, more reviews winning a tie', () => {
  expect(idsOf(sortProducts(PRODUCTS, 'rating'))).toEqual([3, 1, 2]);
});

test('orders names alphabetically, ignoring case', () => {
  expect(idsOf(sortProducts(PRODUCTS, 'title'))).toEqual([2, 1, 3]);
});

test('keeps equal products in their original order', () => {
  const sameName = [makeProduct(7), makeProduct(8, { title: 'Product 7' })];

  expect(idsOf(sortProducts(sameName, 'title'))).toEqual([7, 8]);
});

test('leaves the given list untouched', () => {
  sortProducts(PRODUCTS, 'priceHighToLow');

  expect(idsOf(PRODUCTS)).toEqual([1, 2, 3]);
});

test('sorts an empty list', () => {
  expect(sortProducts([], 'rating')).toEqual([]);
});
