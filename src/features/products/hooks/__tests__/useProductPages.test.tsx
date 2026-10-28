import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { fetchProducts } from '../../services/productsService';
import { makeProducts } from '../../testUtils';
import type { Product } from '../../types';
import { useProductPages } from '../useProductPages';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);

type ProductPages = ReturnType<typeof useProductPages>;

/** Makes the next fetch wait until the test settles it. */
function nextRequest() {
  const request = Promise.withResolvers<Product[]>();
  mockFetchProducts.mockReturnValueOnce(request.promise);
  return request;
}

let renderer: Renderer | undefined;

async function renderPages() {
  let pages!: ProductPages;
  function Probe() {
    pages = useProductPages();
    return null;
  }

  await act(async () => {
    renderer = ReactTestRenderer.create(<Probe />);
  });

  return () => pages;
}

async function renderLoadedPages() {
  const first = nextRequest();
  const getPages = await renderPages();
  await act(async () => first.resolve(makeProducts(1, 10)));
  return getPages;
}

beforeEach(() => {
  mockFetchProducts.mockReset();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('loads the first ten products', async () => {
  const first = nextRequest();
  const getPages = await renderPages();

  expect(getPages().status).toBe('loading');
  expect(mockFetchProducts).toHaveBeenCalledWith(10);

  await act(async () => first.resolve(makeProducts(1, 10)));

  expect(getPages().status).toBe('success');
  expect(getPages().products).toHaveLength(10);
  expect(getPages().hasMore).toBe(true);
});

test('loads ten more at a time until the API runs out', async () => {
  const getPages = await renderLoadedPages();

  const second = nextRequest();
  await act(async () => getPages().loadMore());

  expect(mockFetchProducts).toHaveBeenLastCalledWith(20);
  expect(getPages().loadingMore).toBe(true);

  await act(async () => second.resolve(makeProducts(1, 20)));

  expect(getPages().products).toHaveLength(20);
  expect(getPages().loadingMore).toBe(false);

  const third = nextRequest();
  await act(async () => getPages().loadMore());
  expect(mockFetchProducts).toHaveBeenLastCalledWith(30);
  await act(async () => third.resolve(makeProducts(1, 20)));

  expect(getPages().hasMore).toBe(false);

  await act(async () => getPages().loadMore());
  expect(mockFetchProducts).toHaveBeenCalledTimes(3);
});

test('asks for one page however often the end is reached', async () => {
  const getPages = await renderLoadedPages();

  nextRequest();
  await act(async () => {
    getPages().loadMore();
    getPages().loadMore();
  });
  await act(async () => getPages().loadMore());

  expect(mockFetchProducts).toHaveBeenCalledTimes(2);
});

test('does not load more before the first page is in', async () => {
  nextRequest();
  const getPages = await renderPages();

  await act(async () => getPages().loadMore());

  expect(mockFetchProducts).toHaveBeenCalledTimes(1);
});

test('keeps the rows when a page fails and waits for a retry', async () => {
  const getPages = await renderLoadedPages();

  const failed = nextRequest();
  await act(async () => getPages().loadMore());
  await act(async () => failed.reject(new Error('Network down')));

  expect(getPages().loadMoreFailed).toBe(true);
  expect(getPages().products).toHaveLength(10);

  await act(async () => getPages().loadMore());
  expect(mockFetchProducts).toHaveBeenCalledTimes(2);

  const retried = nextRequest();
  await act(async () => getPages().retryLoadMore());
  expect(mockFetchProducts).toHaveBeenLastCalledWith(20);
  await act(async () => retried.resolve(makeProducts(1, 20)));

  expect(getPages().loadMoreFailed).toBe(false);
  expect(getPages().products).toHaveLength(20);
});

test('refresh goes back to the first page', async () => {
  const getPages = await renderLoadedPages();
  const second = nextRequest();
  await act(async () => getPages().loadMore());
  await act(async () => second.resolve(makeProducts(1, 20)));

  const refreshed = nextRequest();
  await act(async () => getPages().refresh());

  expect(mockFetchProducts).toHaveBeenLastCalledWith(10);
  expect(getPages().refreshing).toBe(true);
  expect(getPages().products).toHaveLength(20);

  await act(async () => refreshed.resolve(makeProducts(1, 10)));

  expect(getPages().refreshing).toBe(false);
  expect(getPages().products).toHaveLength(10);
});

test('ignores a page that lands after a refresh started', async () => {
  const getPages = await renderLoadedPages();

  const more = nextRequest();
  await act(async () => getPages().loadMore());
  const refreshed = nextRequest();
  await act(async () => getPages().refresh());
  await act(async () => refreshed.resolve(makeProducts(1, 10)));
  await act(async () => more.resolve(makeProducts(1, 20)));

  expect(getPages().products).toHaveLength(10);
  expect(getPages().loadingMore).toBe(false);
});

test('retry reloads after a failed first page', async () => {
  const failed = nextRequest();
  const getPages = await renderPages();
  await act(async () => failed.reject(new Error('Network down')));

  expect(getPages().status).toBe('error');

  const retried = nextRequest();
  await act(async () => getPages().retry());

  expect(getPages().status).toBe('loading');

  await act(async () => retried.resolve(makeProducts(1, 10)));

  expect(getPages().status).toBe('success');
});
