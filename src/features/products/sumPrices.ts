import type { Product } from './types';

/** Total price of `products`; formatting rounds away floating-point noise. */
export function sumPrices(products: readonly Product[]): number {
  return products.reduce((total, product) => total + product.price, 0);
}
