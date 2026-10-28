import ReactTestRenderer from 'react-test-renderer';

import { ErrorBoundary } from '@/test-utils/ErrorBoundary';
import { ProductsProvider, useProducts } from '../ProductsProvider';
import { fetchProducts } from '../services/productsService';
import { makeProducts } from '../testUtils';

jest.mock('../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);

beforeEach(() => {
  mockFetchProducts.mockReset();
});

test('loads the first page and shares it', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
  const seen: number[][] = [];
  function Probe() {
    seen.push(useProducts().products.map(product => product.id));
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <ProductsProvider>
        <Probe />
        <Probe />
      </ProductsProvider>,
    );
  });

  expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  expect(seen.slice(-2)).toEqual([
    makeProducts(1, 10).map(product => product.id),
    makeProducts(1, 10).map(product => product.id),
  ]);
});

test('useProducts throws outside <ProductsProvider>', async () => {
  // React logs errors caught by a boundary; keep the test output clean.
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  const onError = jest.fn();
  function Probe() {
    useProducts();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <ErrorBoundary onError={onError}>
        <Probe />
      </ErrorBoundary>,
    );
  });

  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({
      message: 'Product hooks must be used inside <ProductsProvider>.',
    }),
  );

  consoleError.mockRestore();
});
