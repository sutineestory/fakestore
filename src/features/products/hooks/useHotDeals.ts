import { useCallback, useEffect, useMemo, useState } from 'react';

import { filterByTitle } from '@/utils/filterByTitle';
import { filterByCategories } from '../filterByCategories';
import { useProducts } from '../ProductsProvider';
import { sortProducts, type ProductSort } from '../sortProducts';

/**
 * The paged product list as hot deals, narrowed by a title search and by
 * category, and put in the chosen order. The API can do none of these, so
 * while any is in use the remaining pages load too and every product is
 * refined on the device.
 */
export function useHotDeals() {
  const pages = useProducts();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<readonly string[]>([]);
  const [sort, setSort] = useState<ProductSort>('recommended');
  const search = query.trim();
  const refining =
    search !== '' || categories.length > 0 || sort !== 'recommended';
  const { loadMore } = pages;

  // `loadMore` changes with every page and does nothing once the last one is
  // in or a page failed, so this pages through to the end.
  useEffect(() => {
    if (refining) {
      loadMore();
    }
  }, [refining, loadMore]);

  const products = useMemo(
    () =>
      sortProducts(
        filterByCategories(filterByTitle(pages.products, search), categories),
        sort,
      ),
    [pages.products, search, categories, sort],
  );

  const toggleCategory = useCallback((category: string) => {
    setCategories(current =>
      current.includes(category)
        ? current.filter(chosen => chosen !== category)
        : [...current, category],
    );
  }, []);

  const clearCategories = useCallback(() => setCategories([]), []);

  return {
    ...pages,
    products,
    query,
    setQuery,
    search,
    categories,
    toggleCategory,
    clearCategories,
    sort,
    setSort,
  };
}
