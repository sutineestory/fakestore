import {
  canLoadMore,
  INITIAL_PAGES,
  nextPageLimit,
  productPagesReducer,
  type ProductPagesAction,
  type ProductPagesState,
} from '../productPages';
import { makeProducts } from '../testUtils';

function reduce(state: ProductPagesState, ...actions: ProductPagesAction[]) {
  return actions.reduce(productPagesReducer, state);
}

const FIRST_PAGE = reduce(INITIAL_PAGES, {
  type: 'succeed',
  request: 'initial',
  limit: 10,
  products: makeProducts(1, 10),
});

const ids = (state: ProductPagesState) => state.products.map(p => p.id);

test('starts loading with nothing to show', () => {
  expect(INITIAL_PAGES).toMatchObject({
    status: 'loading',
    products: [],
    hasMore: false,
  });
});

test('a full first page means there may be more', () => {
  expect(FIRST_PAGE).toMatchObject({ status: 'success', hasMore: true });
  expect(ids(FIRST_PAGE)).toEqual(makeProducts(1, 10).map(p => p.id));
});

test('a short first page is the whole list', () => {
  const state = reduce(INITIAL_PAGES, {
    type: 'succeed',
    request: 'initial',
    limit: 10,
    products: makeProducts(1, 4),
  });

  expect(state).toMatchObject({ status: 'success', hasMore: false });
});

test('a failed first page shows the error', () => {
  const state = reduce(INITIAL_PAGES, { type: 'fail', request: 'initial' });

  expect(state).toMatchObject({ status: 'error', products: [] });
});

test('loading more appends only the products not loaded yet', () => {
  const loading = reduce(FIRST_PAGE, { type: 'start', request: 'more' });
  expect(loading.loadingMore).toBe(true);

  const loaded = reduce(loading, {
    type: 'succeed',
    request: 'more',
    limit: 20,
    products: makeProducts(1, 20),
  });

  expect(ids(loaded)).toEqual(makeProducts(1, 20).map(p => p.id));
  expect(loaded).toMatchObject({ loadingMore: false, hasMore: true });
});

test('stops once a page adds nothing new', () => {
  const state = reduce(
    FIRST_PAGE,
    { type: 'start', request: 'more' },
    {
      type: 'succeed',
      request: 'more',
      limit: 20,
      products: makeProducts(1, 20),
    },
    { type: 'start', request: 'more' },
    {
      type: 'succeed',
      request: 'more',
      limit: 30,
      products: makeProducts(1, 20),
    },
  );

  expect(state.products).toHaveLength(20);
  expect(state.hasMore).toBe(false);
});

test('stops when a page comes back short', () => {
  const state = reduce(
    FIRST_PAGE,
    { type: 'start', request: 'more' },
    {
      type: 'succeed',
      request: 'more',
      limit: 20,
      products: makeProducts(1, 15),
    },
  );

  expect(state.products).toHaveLength(15);
  expect(state.hasMore).toBe(false);
});

test('a failed page keeps the rows and flags the failure', () => {
  const state = reduce(
    FIRST_PAGE,
    { type: 'start', request: 'more' },
    { type: 'fail', request: 'more' },
  );

  expect(state).toMatchObject({
    status: 'success',
    loadingMore: false,
    loadMoreFailed: true,
  });
  expect(state.products).toHaveLength(10);

  const retried = reduce(state, { type: 'start', request: 'more' });
  expect(retried.loadMoreFailed).toBe(false);
});

test('refresh keeps the rows until the first page is back', () => {
  const longList = reduce(
    FIRST_PAGE,
    { type: 'start', request: 'more' },
    {
      type: 'succeed',
      request: 'more',
      limit: 20,
      products: makeProducts(1, 20),
    },
  );

  const refreshing = reduce(longList, { type: 'start', request: 'refresh' });
  expect(refreshing.refreshing).toBe(true);
  expect(refreshing.products).toHaveLength(20);

  const refreshed = reduce(refreshing, {
    type: 'succeed',
    request: 'refresh',
    limit: 10,
    products: makeProducts(1, 10),
  });
  expect(refreshed).toMatchObject({ refreshing: false, hasMore: true });
  expect(refreshed.products).toHaveLength(10);
});

test('a failed refresh shows the error', () => {
  const state = reduce(
    FIRST_PAGE,
    { type: 'start', request: 'refresh' },
    { type: 'fail', request: 'refresh' },
  );

  expect(state).toMatchObject({
    status: 'error',
    products: [],
    refreshing: false,
  });
});

test('retrying starts over', () => {
  const failed = reduce(INITIAL_PAGES, { type: 'fail', request: 'initial' });

  expect(reduce(failed, { type: 'start', request: 'initial' })).toBe(
    INITIAL_PAGES,
  );
});

describe('canLoadMore', () => {
  test('only once a page has loaded and more may exist', () => {
    expect(canLoadMore(INITIAL_PAGES)).toBe(false);
    expect(canLoadMore(FIRST_PAGE)).toBe(true);
    expect(canLoadMore({ ...FIRST_PAGE, hasMore: false })).toBe(false);
    expect(canLoadMore({ ...FIRST_PAGE, status: 'error' })).toBe(false);
  });

  test('not while another request is running', () => {
    expect(canLoadMore({ ...FIRST_PAGE, loadingMore: true })).toBe(false);
    expect(canLoadMore({ ...FIRST_PAGE, refreshing: true })).toBe(false);
  });
});

test('nextPageLimit asks for one page past the loaded products', () => {
  expect(nextPageLimit(INITIAL_PAGES)).toBe(10);
  expect(nextPageLimit(FIRST_PAGE)).toBe(20);
});
