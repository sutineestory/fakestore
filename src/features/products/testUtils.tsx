import type { Product } from './types';

export function makeProduct(id: number, overrides?: Partial<Product>): Product {
  return {
    id,
    title: `Product ${id}`,
    price: id + 0.5,
    description: `Description of product ${id}.`,
    category: 'electronics',
    image: `https://fakestoreapi.com/img/${id}.png`,
    rating: { rate: 4.1, count: 10 * id },
    ...overrides,
  };
}

/** Products `from`..`to`, inclusive. */
export function makeProducts(from: number, to: number): Product[] {
  return Array.from({ length: to - from + 1 }, (_, index) =>
    makeProduct(from + index),
  );
}
