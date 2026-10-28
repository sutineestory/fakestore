import { useEffect, useMemo, useState } from 'react';

import { filterByTitle } from '@/utils/filterByTitle';
import { useProducts } from '../ProductsProvider';
import { sortProducts, type ProductSort } from '../sortProducts';

/**
 * The paged product list as hot deals, narrowed by a title search and put in
 * the chosen order. The API can do neither, so while either is in use the
 * remaining pages load too and every product is refined on the device.
 */
export function useHotDeals() {
  const pages = useProducts();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProductSort>('recommended');
  const search = query.trim();
  const refining = search !== '' || sort !== 'recommended';
  const { loadMore } = pages;

  // `loadMore` changes with every page and does nothing once the last one is
  // in or a page failed, so this pages through to the end.
  useEffect(() => {
    if (refining) {
      loadMore();
    }
  }, [refining, loadMore]);

  const products = useMemo(
    () => sortProducts(filterByTitle(pages.products, search), sort),
    [pages.products, search, sort],
  );

  return { ...pages, products, query, setQuery, search, sort, setSort };
}
