import { useCallback, useEffect, useState } from 'react';

import { fetchCategories } from '../services/productsService';

type CategoriesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; categories: string[] };

const LOADING: CategoriesState = { status: 'loading' };

const NO_CATEGORIES: string[] = [];

/**
 * The API's product categories, loaded on mount. `categories` stays empty
 * until they arrive; `retry` loads them again after a failure.
 */
export function useProductCategories() {
  const [state, setState] = useState<CategoriesState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Ignore a response that lands after unmount.
    let stale = false;
    fetchCategories().then(
      categories => {
        if (!stale) {
          setState({ status: 'success', categories });
        }
      },
      () => {
        if (!stale) {
          setState({ status: 'error' });
        }
      },
    );
    return () => {
      stale = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt(current => current + 1);
  }, []);

  return {
    status: state.status,
    categories: state.status === 'success' ? state.categories : NO_CATEGORIES,
    retry,
  };
}
