import type { Product } from './types';

export const PAGE_SIZE = 10;

/** `initial` replaces everything (first load, retry), `refresh` keeps rows until it lands, `more` appends. */
export type PageRequest = 'initial' | 'refresh' | 'more';

export type ProductPagesState = {
  /** State of the first page; drives the full-list spinner and error. */
  status: 'loading' | 'error' | 'success';
  products: Product[];
  hasMore: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  loadMoreFailed: boolean;
};

export type ProductPagesAction =
  | { type: 'start'; request: PageRequest }
  | {
      type: 'succeed';
      request: PageRequest;
      limit: number;
      products: Product[];
    }
  | { type: 'fail'; request: PageRequest };

export const INITIAL_PAGES: ProductPagesState = {
  status: 'loading',
  products: [],
  hasMore: false,
  refreshing: false,
  loadingMore: false,
  loadMoreFailed: false,
};

const SETTLED = { refreshing: false, loadingMore: false } as const;

export function productPagesReducer(
  state: ProductPagesState,
  action: ProductPagesAction,
): ProductPagesState {
  switch (action.type) {
    case 'start':
      return startRequest(state, action.request);
    case 'succeed': {
      // A short response means the API has run out of products.
      const full = action.products.length === action.limit;
      if (action.request !== 'more') {
        return {
          ...state,
          ...SETTLED,
          status: 'success',
          products: action.products,
          hasMore: full,
        };
      }
      // The API has no offset, so a page re-sends every earlier product too.
      const loaded = new Set(state.products.map(product => product.id));
      const added = action.products.filter(product => !loaded.has(product.id));
      return {
        ...state,
        ...SETTLED,
        products: [...state.products, ...added],
        hasMore: full && added.length > 0,
      };
    }
    case 'fail':
      if (action.request === 'more') {
        return { ...state, ...SETTLED, loadMoreFailed: true };
      }
      return { ...INITIAL_PAGES, status: 'error' };
  }
}

function startRequest(
  state: ProductPagesState,
  request: PageRequest,
): ProductPagesState {
  switch (request) {
    case 'initial':
      return INITIAL_PAGES;
    case 'refresh':
      return { ...state, refreshing: true, loadMoreFailed: false };
    case 'more':
      return { ...state, loadingMore: true, loadMoreFailed: false };
  }
}

/** Whether another page can be requested right now. */
export function canLoadMore(state: ProductPagesState): boolean {
  return (
    state.status === 'success' &&
    state.hasMore &&
    !state.refreshing &&
    !state.loadingMore
  );
}

/** The `limit` that fetches one page past what is loaded. */
export function nextPageLimit(state: ProductPagesState): number {
  return state.products.length + PAGE_SIZE;
}
