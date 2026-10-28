import { useCallback, useEffect, useReducer, useRef } from 'react';

import {
  canLoadMore,
  INITIAL_PAGES,
  nextPageLimit,
  PAGE_SIZE,
  productPagesReducer,
  type PageRequest,
} from '../productPages';
import { fetchProducts } from '../services/productsService';

/**
 * Loads products a page at a time. `loadMore` is safe to call from
 * `onEndReached`: it does nothing while a request is running, at the end of
 * the list, or after a failed page until `retryLoadMore` is pressed.
 */
export function useProductPages() {
  const [state, dispatch] = useReducer(productPagesReducer, INITIAL_PAGES);
  // Refs rather than state: two end-reached events can fire before the next
  // render, and only the newest request may write its result.
  const latestRequest = useRef(0);
  const inFlight = useRef(false);

  const request = useCallback((kind: PageRequest, limit: number) => {
    const id = ++latestRequest.current;
    inFlight.current = true;
    dispatch({ type: 'start', request: kind });
    fetchProducts(limit).then(
      products => {
        if (id === latestRequest.current) {
          inFlight.current = false;
          dispatch({ type: 'succeed', request: kind, limit, products });
        }
      },
      () => {
        if (id === latestRequest.current) {
          inFlight.current = false;
          dispatch({ type: 'fail', request: kind });
        }
      },
    );
  }, []);

  useEffect(() => {
    request('initial', PAGE_SIZE);
    return () => {
      // Drop whatever is still in flight once unmounted.
      latestRequest.current += 1;
      inFlight.current = false;
    };
  }, [request]);

  const retryLoadMore = useCallback(() => {
    if (!inFlight.current && canLoadMore(state)) {
      request('more', nextPageLimit(state));
    }
  }, [request, state]);

  const loadMore = useCallback(() => {
    if (!state.loadMoreFailed) {
      retryLoadMore();
    }
  }, [retryLoadMore, state.loadMoreFailed]);

  const refresh = useCallback(() => request('refresh', PAGE_SIZE), [request]);

  const retry = useCallback(() => request('initial', PAGE_SIZE), [request]);

  return { ...state, loadMore, retryLoadMore, refresh, retry };
}
