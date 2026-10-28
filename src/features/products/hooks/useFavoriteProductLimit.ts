import { useCallback, useState } from 'react';

import { useFavorites } from '@/features/favorites';
import { countFavoriteProducts, MAX_FAVORITE_PRODUCTS } from '../favoriteLimit';

/**
 * A `beforeAdd` check for favorite buttons: allows adding while there is room,
 * otherwise refuses and sets `limitReached` so the screen can explain why.
 */
export function useFavoriteProductLimit() {
  const { favoriteIds } = useFavorites();
  const [limitReached, setLimitReached] = useState(false);

  const beforeAdd = useCallback(() => {
    if (countFavoriteProducts(favoriteIds) < MAX_FAVORITE_PRODUCTS) {
      return true;
    }
    setLimitReached(true);
    return false;
  }, [favoriteIds]);

  const dismissLimit = useCallback(() => setLimitReached(false), []);

  return { beforeAdd, limitReached, dismissLimit };
}
