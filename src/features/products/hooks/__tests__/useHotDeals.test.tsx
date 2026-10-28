import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ProductsProvider } from '../../ProductsProvider';
import { fetchProducts } from '../../services/productsService';
import { makeProducts } from '../../testUtils';
import type { Product } from '../../types';
import { useHotDeals } from '../useHotDeals';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);

type HotDeals = ReturnType<typeof useHotDeals>;

/** Makes the next fetch wait until the test settles it. */
function nextRequest() {
  const request = Promise.withResolvers<Product[]>();
  mockFetchProducts.mockReturnValueOnce(request.promise);
  return request;
}

let renderer: Renderer | undefined;

async function renderLoadedDeals() {
  let deals!: HotDeals;
  function Probe() {
    deals = useHotDeals();
    return null;
  }

  const first = nextRequest();
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ProductsProvider>
        <Probe />
      </ProductsProvider>,
    );
  });
  await act(async () => first.resolve(makeProducts(1, 10)));

  return () => deals;
}

function idsOf(products: Product[]) {
  return products.map(product => product.id);
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

test('lists the loaded page as it is until a search starts', async () => {
  const getDeals = await renderLoadedDeals();

  expect(idsOf(getDeals().products)).toEqual(idsOf(makeProducts(1, 10)));
  expect(getDeals().query).toBe('');
  expect(mockFetchProducts).toHaveBeenCalledTimes(1);
});

test('keeps the typed query and searches by its trimmed title', async () => {
  const getDeals = await renderLoadedDeals();
  nextRequest();

  await act(async () => getDeals().setQuery('  product 1 '));

  expect(getDeals().query).toBe('  product 1 ');
  expect(getDeals().search).toBe('product 1');
  expect(idsOf(getDeals().products)).toEqual([1, 10]);
});

test('loads every remaining page while searching', async () => {
  const getDeals = await renderLoadedDeals();

  const second = nextRequest();
  await act(async () => getDeals().setQuery('product 1'));
  expect(mockFetchProducts).toHaveBeenLastCalledWith(20);

  const third = nextRequest();
  await act(async () => second.resolve(makeProducts(1, 20)));
  expect(mockFetchProducts).toHaveBeenLastCalledWith(30);

  await act(async () => third.resolve(makeProducts(1, 20)));

  expect(getDeals().hasMore).toBe(false);
  expect(mockFetchProducts).toHaveBeenCalledTimes(3);
  expect(idsOf(getDeals().products)).toEqual([
    1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ]);
});

test('stops paging after a failed page until it is retried', async () => {
  const getDeals = await renderLoadedDeals();

  const failed = nextRequest();
  await act(async () => getDeals().setQuery('product'));
  await act(async () => failed.reject(new Error('Network down')));
  await act(async () => getDeals().setQuery('product 2'));

  expect(getDeals().loadMoreFailed).toBe(true);
  expect(mockFetchProducts).toHaveBeenCalledTimes(2);

  const retried = nextRequest();
  await act(async () => getDeals().retryLoadMore());
  nextRequest();
  await act(async () => retried.resolve(makeProducts(1, 20)));

  expect(mockFetchProducts).toHaveBeenLastCalledWith(30);
  expect(idsOf(getDeals().products)).toEqual([2, 20]);
});

test('lists everything again once the search is cleared', async () => {
  const getDeals = await renderLoadedDeals();
  nextRequest();
  await act(async () => getDeals().setQuery('product 1'));

  await act(async () => getDeals().setQuery(''));

  expect(idsOf(getDeals().products)).toEqual(idsOf(makeProducts(1, 10)));
});
