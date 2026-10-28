// The favorites set also holds the Home screen's placeholder ids ('1'..'4'),
// so product ids are prefixed to keep product 2 and placeholder 2 apart.
const PREFIX = 'product:';
const PRODUCT_KEY = /^product:(\d+)$/;

/** The key a product is stored under in the favorites set. */
export function productFavoriteId(id: number): string {
  return `${PREFIX}${id}`;
}

/** The product id behind a favorites key, or null for any other kind of key. */
export function parseProductFavoriteId(key: string): number | null {
  const match = PRODUCT_KEY.exec(key);
  return match ? Number(match[1]) : null;
}
