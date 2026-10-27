import { useCallback } from 'react';

import { useFavorites } from '../FavoritesProvider';

export function useFavorite(id: string) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.has(id);

  // Stable across renders so callers can pass it to memoised children.
  const toggle = useCallback(() => toggleFavorite(id), [toggleFavorite, id]);

  return { isFavorite, toggle };
}
