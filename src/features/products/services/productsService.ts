import type { Product } from '../types';

const API_URL = 'https://fakestoreapi.com/products';

type ProductDto = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

function toProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    description: dto.description,
    category: dto.category,
    image: dto.image,
    rating: { rate: dto.rating.rate, count: dto.rating.count },
  };
}

// fetch only rejects on network failure, so 4xx/5xx have to become errors here.
async function get(url: string): Promise<Response> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
}

/**
 * The first `limit` products. The API has no offset, so callers page by
 * asking for a larger limit.
 */
export async function fetchProducts(limit: number): Promise<Product[]> {
  const response = await get(`${API_URL}?limit=${limit}`);
  const products: ProductDto[] = await response.json();
  return products.map(toProduct);
}

/** One product, or `null` when no product has that id. */
export async function fetchProduct(id: number): Promise<Product | null> {
  const response = await get(`${API_URL}/${id}`);
  // An unknown id comes back as 200 with an empty body, not a 404.
  const body = await response.text();
  return body ? toProduct(JSON.parse(body)) : null;
}

/** Every category the API files products under, e.g. `"jewelery"`. */
export async function fetchCategories(): Promise<string[]> {
  const response = await get(`${API_URL}/categories`);
  return response.json();
}
