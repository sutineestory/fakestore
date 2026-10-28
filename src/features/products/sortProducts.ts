import type { Product } from './types';

/** Every order the hot deals can be put in, as offered to the user. */
export const PRODUCT_SORTS = [
  'recommended',
  'priceLowToHigh',
  'priceHighToLow',
  'rating',
  'title',
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

type Compare = (a: Product, b: Product) => number;

const COMPARE: Record<Exclude<ProductSort, 'recommended'>, Compare> = {
  priceLowToHigh: (a, b) => a.price - b.price,
  priceHighToLow: (a, b) => b.price - a.price,
  // Of two equal scores, the one more people agreed on comes first.
  rating: (a, b) =>
    b.rating.rate - a.rating.rate || b.rating.count - a.rating.count,
  title: (a, b) => a.title.localeCompare(b.title),
};

/** `products` in the given order; `recommended` keeps the API's order. */
export function sortProducts(
  products: Product[],
  sort: ProductSort,
): Product[] {
  if (sort === 'recommended') {
    return products;
  }
  return [...products].sort(COMPARE[sort]);
}
