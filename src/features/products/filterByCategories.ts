import type { Product } from './types';

/** Products in any of `categories`; with none chosen, every product. */
export function filterByCategories(
  products: Product[],
  categories: readonly string[],
): Product[] {
  if (categories.length === 0) {
    return products;
  }
  return products.filter(product => categories.includes(product.category));
}
