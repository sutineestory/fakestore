import { parseProductFavoriteId } from './productFavoriteId';

function isId(id: number | null): id is number {
  return id !== null;
}

/**
 * Up to `limit` favorited product ids, most recently favorited first. The set
 * keeps insertion order, and keys that aren't products are skipped.
 */
export function selectRecentFavoriteProductIds(
  favoriteIds: ReadonlySet<string>,
  limit: number,
): number[] {
  return [...favoriteIds]
    .reverse()
    .map(parseProductFavoriteId)
    .filter(isId)
    .slice(0, limit);
}
