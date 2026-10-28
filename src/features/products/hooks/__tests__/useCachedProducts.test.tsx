import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ProductsProvider } from '../../ProductsProvider';
import { fetchProduct, fetchProducts } from '../../services/productsService';
import { makeProduct, makeProducts } from '../../testUtils';
import type { Product } from '../../types';
import { useCachedProducts } from '../useCachedProducts';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);
const mockFetchProduct = jest.mocked(fetchProduct);

type CachedProducts = ReturnType<typeof useCachedProducts>;

let renderer: Renderer | undefined;

/** Renders one consumer per id list; each list is created once, so stable. */
async function renderCachedProducts(...idLists: number[][]) {
  const results: CachedProducts[] = [];
  function Probe({ index, ids }: { index: number; ids: number[] }) {
    results[index] = useCachedProducts(ids);
    return null;
  }

  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ProductsProvider>
        {idLists.map((ids, index) => (
          <Probe key={index} index={index} ids={ids} />
        ))}
      </ProductsProvider>,
    );
  });

  return (index = 0) => results[index];
}

const ids = (products: Product[]) => products.map(product => product.id);

beforeEach(() => {
  mockFetchProducts.mockReset();
  mockFetchProduct.mockReset();
  mockFetchProduct.mockImplementation(async id => makeProduct(id));
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('takes products from the loaded list without fetching them', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));

  const getResult = await renderCachedProducts([3, 1]);

  expect(getResult().status).toBe('success');
  expect(ids(getResult().products)).toEqual([3, 1]);
  expect(mockFetchProduct).not.toHaveBeenCalled();
});

test('waits for the first page before fetching by id', async () => {
  const page = Promise.withResolvers<Product[]>();
  mockFetchProducts.mockReturnValue(page.promise);

  const getResult = await renderCachedProducts([3, 15]);

  expect(getResult().status).toBe('loading');
  expect(mockFetchProduct).not.toHaveBeenCalled();

  await act(async () => page.resolve(makeProducts(1, 10)));

  expect(mockFetchProduct).toHaveBeenCalledTimes(1);
  expect(mockFetchProduct).toHaveBeenCalledWith(15);
  expect(getResult().status).toBe('success');
  expect(ids(getResult().products)).toEqual([3, 15]);
});

test('fetches products beyond the loaded list and keeps the order', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));

  const getResult = await renderCachedProducts([18, 2, 12]);

  expect(mockFetchProduct.mock.calls).toEqual([[18], [12]]);
  expect(ids(getResult().products)).toEqual([18, 2, 12]);
});

test('leaves out ids the API does not know, without asking again', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
  mockFetchProduct.mockResolvedValue(null);

  const getResult = await renderCachedProducts([2, 99]);

  expect(getResult().status).toBe('success');
  expect(ids(getResult().products)).toEqual([2]);
  expect(mockFetchProduct).toHaveBeenCalledTimes(1);
});

test('shares fetched products with every consumer', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
  const slow = Promise.withResolvers<Product | null>();
  mockFetchProduct.mockReturnValueOnce(slow.promise);

  const getResult = await renderCachedProducts([15], [15, 1]);
  await act(async () => slow.resolve(makeProduct(15)));

  expect(ids(getResult(0).products)).toEqual([15]);
  expect(ids(getResult(1).products)).toEqual([15, 1]);
});

test('reports a failed fetch and retries on request', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
  mockFetchProduct.mockRejectedValueOnce(new Error('Network down'));

  const getResult = await renderCachedProducts([1, 15]);

  expect(getResult().status).toBe('error');
  expect(ids(getResult().products)).toEqual([1]);

  await act(async () => getResult().retry());

  expect(mockFetchProduct).toHaveBeenCalledTimes(2);
  expect(getResult().status).toBe('success');
  expect(ids(getResult().products)).toEqual([1, 15]);
});

test('succeeds straight away with no ids', async () => {
  mockFetchProducts.mockReturnValue(new Promise(() => {}));

  const getResult = await renderCachedProducts([]);

  expect(getResult()).toMatchObject({ status: 'success', products: [] });
});
