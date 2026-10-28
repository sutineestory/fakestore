import { parseProductFavoriteId } from './productFavoriteId';

/** Most products a user can favorite; the carousel shows them all. */
export const MAX_FAVORITE_PRODUCTS = 5;

/** How many products are favorited; other kinds of favorites don't count. */
export function countFavoriteProducts(
  favoriteIds: ReadonlySet<string>,
): number {
  let count = 0;
  for (const key of favoriteIds) {
    if (parseProductFavoriteId(key) !== null) {
      count += 1;
    }
  }
  return count;
}
