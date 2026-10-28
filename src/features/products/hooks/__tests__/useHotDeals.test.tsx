import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ProductsProvider } from '../../ProductsProvider';
import { fetchProducts } from '../../services/productsService';
import { makeProduct, makeProducts } from '../../testUtils';
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

async function renderLoadedDeals(firstPage = makeProducts(1, 10)) {
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
  await act(async () => first.resolve(firstPage));

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

test('starts in the API order', async () => {
  const getDeals = await renderLoadedDeals();

  expect(getDeals().sort).toBe('recommended');
});

test('puts every product in the chosen order once all pages are in', async () => {
  const getDeals = await renderLoadedDeals();

  const second = nextRequest();
  await act(async () => getDeals().setSort('priceHighToLow'));

  expect(idsOf(getDeals().products)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

  const third = nextRequest();
  await act(async () => second.resolve(makeProducts(1, 20)));
  await act(async () => third.resolve(makeProducts(1, 20)));

  expect(getDeals().products[0].id).toBe(20);
  expect(getDeals().products).toHaveLength(20);
});

test('sorts only the products that match the search', async () => {
  const getDeals = await renderLoadedDeals();
  nextRequest();

  await act(async () => {
    getDeals().setQuery('product 1');
    getDeals().setSort('priceHighToLow');
  });

  expect(idsOf(getDeals().products)).toEqual([10, 1]);
});

test('goes back to the API order', async () => {
  const getDeals = await renderLoadedDeals();
  nextRequest();
  await act(async () => getDeals().setSort('priceHighToLow'));

  await act(async () => getDeals().setSort('recommended'));

  expect(idsOf(getDeals().products)).toEqual(idsOf(makeProducts(1, 10)));
});

/** Odd ids are electronics, even ids jewelery. */
function makeMixedProducts(to: number) {
  return makeProducts(1, to).map(product =>
    makeProduct(product.id, {
      category: product.id % 2 ? 'electronics' : 'jewelery',
    }),
  );
}

test('starts with no category chosen', async () => {
  const getDeals = await renderLoadedDeals();

  expect(getDeals().categories).toEqual([]);
});

test('keeps only the chosen categories, from every page', async () => {
  const getDeals = await renderLoadedDeals(makeMixedProducts(10));

  const second = nextRequest();
  await act(async () => getDeals().toggleCategory('jewelery'));

  expect(getDeals().categories).toEqual(['jewelery']);

  const third = nextRequest();
  await act(async () => second.resolve(makeMixedProducts(20)));
  await act(async () => third.resolve(makeMixedProducts(20)));

  expect(idsOf(getDeals().products)).toEqual([
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20,
  ]);
});

test('toggles a category off again', async () => {
  const getDeals = await renderLoadedDeals();
  nextRequest();
  await act(async () => getDeals().toggleCategory('jewelery'));
  await act(async () => getDeals().toggleCategory('electronics'));

  await act(async () => getDeals().toggleCategory('jewelery'));

  expect(getDeals().categories).toEqual(['electronics']);
});

test('clears every chosen category', async () => {
  const getDeals = await renderLoadedDeals();
  nextRequest();
  await act(async () => getDeals().toggleCategory('jewelery'));

  await act(async () => getDeals().clearCategories());

  expect(getDeals().categories).toEqual([]);
  expect(idsOf(getDeals().products)).toEqual(idsOf(makeProducts(1, 10)));
});

test('searches, filters and sorts together', async () => {
  const getDeals = await renderLoadedDeals(makeMixedProducts(10));
  const second = nextRequest();
  const third = nextRequest();

  await act(async () => {
    getDeals().setQuery('product 1');
    getDeals().toggleCategory('jewelery');
    getDeals().setSort('priceHighToLow');
  });
  await act(async () => second.resolve(makeMixedProducts(20)));
  await act(async () => third.resolve(makeMixedProducts(20)));

  expect(idsOf(getDeals().products)).toEqual([18, 16, 14, 12, 10]);
});
