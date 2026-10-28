import { useCallback, useEffect, useMemo, useState } from 'react';

import { useProductsContext } from '../ProductsProvider';
import { fetchProduct } from '../services/productsService';
import type { Product } from '../types';

function isProduct(product: Product | null | undefined): product is Product {
  return product != null;
}

/**
 * Products for `ids`, in order. Takes them from the loaded list when it can
 * and fetches the rest one by one; ids the API doesn't know are left out.
 * Pass a memoised array.
 */
export function useCachedProducts(ids: readonly number[]) {
  const { pages, getProduct, rememberProducts } = useProductsContext();
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const missingKey = ids.filter(id => getProduct(id) === undefined).join(',');
  // Most ids arrive with the first page; fetching them early would duplicate it.
  const waitingForList = pages.status === 'loading';

  useEffect(() => {
    if (!missingKey || waitingForList) {
      return;
    }
    let stale = false;
    const missing = missingKey.split(',').map(Number);
    Promise.all(missing.map(id => fetchProduct(id))).then(
      products => {
        if (!stale) {
          rememberProducts(missing.map((id, index) => [id, products[index]]));
        }
      },
      () => {
        if (!stale) {
          setFailedKey(missingKey);
        }
      },
    );
    return () => {
      stale = true;
    };
  }, [missingKey, waitingForList, attempt, rememberProducts]);

  const products = useMemo(
    () => ids.map(getProduct).filter(isProduct),
    [ids, getProduct],
  );

  const status: 'loading' | 'error' | 'success' = !missingKey
    ? 'success'
    : failedKey === missingKey
    ? 'error'
    : 'loading';

  const retry = useCallback(() => {
    setFailedKey(null);
    setAttempt(current => current + 1);
  }, []);

  return { status, products, retry };
}
