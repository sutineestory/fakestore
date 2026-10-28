import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { useProductPages } from './hooks/useProductPages';
import type { Product } from './types';

type ProductPages = ReturnType<typeof useProductPages>;

/** `undefined`: never loaded; `null`: the API has no product with that id. */
export type CachedProduct = Product | null | undefined;

type ProductsContextValue = {
  pages: ProductPages;
  getProduct: (id: number) => CachedProduct;
  rememberProducts: (entries: [number, Product | null][]) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

/**
 * Owns the paged product list and a cache of products fetched one by one
 * (favorites and details beyond the loaded pages), so every screen reads the
 * same data.
 */
export function ProductsProvider({ children }: PropsWithChildren) {
  const pages = useProductPages();
  const [fetched, setFetched] = useState<ReadonlyMap<number, Product | null>>(
    () => new Map(),
  );

  const pageProducts = useMemo(
    () => new Map(pages.products.map(product => [product.id, product])),
    [pages.products],
  );

  // The list is the fresher copy, so it wins over a product fetched earlier.
  const getProduct = useCallback(
    (id: number) => pageProducts.get(id) ?? fetched.get(id),
    [pageProducts, fetched],
  );

  const rememberProducts = useCallback(
    (entries: [number, Product | null][]) => {
      setFetched(current => new Map([...current, ...entries]));
    },
    [],
  );

  const value = useMemo<ProductsContextValue>(
    () => ({ pages, getProduct, rememberProducts }),
    [pages, getProduct, rememberProducts],
  );

  return <ProductsContext value={value}>{children}</ProductsContext>;
}

export function useProductsContext(): ProductsContextValue {
  const context = use(ProductsContext);
  if (!context) {
    throw new Error('Product hooks must be used inside <ProductsProvider>.');
  }
  return context;
}

/** The paged product list with its load-more, refresh and retry actions. */
export function useProducts(): ProductPages {
  return useProductsContext().pages;
}
