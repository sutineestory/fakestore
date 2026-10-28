// The favorites set also holds the Home screen's placeholder ids ('1'..'4'),
// so product ids are prefixed to keep product 2 and placeholder 2 apart.
const PREFIX = 'product:';

/** The key a product is stored under in the favorites set. */
export function productFavoriteId(id: number): string {
  return `${PREFIX}${id}`;
}
