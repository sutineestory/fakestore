import type { Product } from '../../types';
import { fetchProduct, fetchProducts } from '../productsService';

const PRODUCT: Product = {
  id: 1,
  title: 'Backpack',
  price: 109.95,
  description: 'Fits 15" laptops.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/backpack.png',
  rating: { rate: 3.9, count: 120 },
};

const mockFetch = jest.spyOn(globalThis, 'fetch');

function respondWith(body: string, status = 200) {
  mockFetch.mockResolvedValueOnce(new Response(body, { status }));
}

beforeEach(() => {
  mockFetch.mockReset();
});

afterAll(() => {
  mockFetch.mockRestore();
});

describe('fetchProducts', () => {
  test('asks the API for the first `limit` products as JSON', async () => {
    respondWith('[]');

    await fetchProducts(10);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products?limit=10',
      { headers: { Accept: 'application/json' } },
    );
  });

  test('resolves with the products', async () => {
    respondWith(JSON.stringify([PRODUCT, { ...PRODUCT, id: 2 }]));

    await expect(fetchProducts(2)).resolves.toEqual([
      PRODUCT,
      { ...PRODUCT, id: 2 },
    ]);
  });

  test('drops fields the app does not use', async () => {
    respondWith(JSON.stringify([{ ...PRODUCT, sku: 'BP-1' }]));

    await expect(fetchProducts(1)).resolves.toEqual([PRODUCT]);
  });

  test('rejects with the status of a failed response', async () => {
    respondWith('Server error', 500);

    await expect(fetchProducts(10)).rejects.toThrow(
      'Request failed with status 500',
    );
  });

  test('rejects when the network fails', async () => {
    const error = new TypeError('Network request failed');
    mockFetch.mockRejectedValueOnce(error);

    await expect(fetchProducts(10)).rejects.toBe(error);
  });
});

describe('fetchProduct', () => {
  test('asks the API for one product by id', async () => {
    respondWith(JSON.stringify(PRODUCT));

    await expect(fetchProduct(1)).resolves.toEqual(PRODUCT);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products/1',
      { headers: { Accept: 'application/json' } },
    );
  });

  test('resolves with null for an unknown id', async () => {
    respondWith('');

    await expect(fetchProduct(999)).resolves.toBeNull();
  });

  test('rejects with the status of a failed response', async () => {
    respondWith('Not found', 404);

    await expect(fetchProduct(1)).rejects.toThrow(
      'Request failed with status 404',
    );
  });
});
