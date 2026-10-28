import { useMemo } from 'react';

import { useCachedProducts } from './useCachedProducts';

/** One product by id; `product` is null while loading or when it doesn't exist. */
export function useProduct(id: number) {
  const ids = useMemo(() => [id], [id]);
  const { status, products, retry } = useCachedProducts(ids);

  return { status, product: products[0] ?? null, retry };
}
