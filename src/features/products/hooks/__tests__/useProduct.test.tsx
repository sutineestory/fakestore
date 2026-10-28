import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ProductsProvider } from '../../ProductsProvider';
import { fetchProduct, fetchProducts } from '../../services/productsService';
import { makeProduct, makeProducts } from '../../testUtils';
import { useProduct } from '../useProduct';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchProducts = jest.mocked(fetchProducts);
const mockFetchProduct = jest.mocked(fetchProduct);

type ProductResult = ReturnType<typeof useProduct>;

let renderer: Renderer | undefined;

async function renderProduct(id: number) {
  let result!: ProductResult;
  function Probe() {
    result = useProduct(id);
    return null;
  }

  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ProductsProvider>
        <Probe />
      </ProductsProvider>,
    );
  });

  return () => result;
}

beforeEach(() => {
  mockFetchProducts.mockReset();
  mockFetchProduct.mockReset();
  mockFetchProducts.mockResolvedValue(makeProducts(1, 10));
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('finds a product in the loaded list', async () => {
  const getResult = await renderProduct(4);

  expect(getResult()).toMatchObject({
    status: 'success',
    product: makeProduct(4),
  });
});

test('fetches a product beyond the loaded list', async () => {
  mockFetchProduct.mockResolvedValue(makeProduct(15));

  const getResult = await renderProduct(15);

  expect(mockFetchProduct).toHaveBeenCalledWith(15);
  expect(getResult().product).toEqual(makeProduct(15));
});

test('has no product while loading', async () => {
  mockFetchProducts.mockReturnValue(new Promise(() => {}));

  const getResult = await renderProduct(4);

  expect(getResult()).toMatchObject({ status: 'loading', product: null });
});

test('has no product when the id does not exist', async () => {
  mockFetchProduct.mockResolvedValue(null);

  const getResult = await renderProduct(99);

  expect(getResult()).toMatchObject({ status: 'success', product: null });
});

test('reports a failed fetch', async () => {
  mockFetchProduct.mockRejectedValue(new Error('Network down'));

  const getResult = await renderProduct(15);

  expect(getResult()).toMatchObject({ status: 'error', product: null });
});
