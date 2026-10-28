import { useEffect, useMemo, useState } from 'react';

import { filterByTitle } from '@/utils/filterByTitle';
import { useProducts } from '../ProductsProvider';

/**
 * The paged product list as hot deals, narrowed by a title search. The API
 * can't search, so while a search is active the remaining pages load too and
 * every product is searched on the device.
 */
export function useHotDeals() {
  const pages = useProducts();
  const [query, setQuery] = useState('');
  const search = query.trim();
  const refining = search !== '';
  const { loadMore } = pages;

  // `loadMore` changes with every page and does nothing once the last one is
  // in or a page failed, so this pages through to the end.
  useEffect(() => {
    if (refining) {
      loadMore();
    }
  }, [refining, loadMore]);

  const products = useMemo(
    () => filterByTitle(pages.products, search),
    [pages.products, search],
  );

  return { ...pages, products, query, setQuery, search };
}
