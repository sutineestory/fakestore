import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useFavorites } from '@/features/favorites';
import { useTranslation } from '@/i18n';
import { countFavoriteProducts, MAX_FAVORITE_PRODUCTS } from '../favoriteLimit';

/**
 * A `beforeAdd` check for favorite buttons: allows adding while there is room,
 * otherwise explains the limit and refuses.
 */
export function useFavoriteProductLimit() {
  const t = useTranslation();
  const { favoriteIds } = useFavorites();

  return useCallback(() => {
    if (countFavoriteProducts(favoriteIds) < MAX_FAVORITE_PRODUCTS) {
      return true;
    }
    Alert.alert(
      t.favorites.fullTitle,
      t.favorites.fullMessage(MAX_FAVORITE_PRODUCTS),
    );
    return false;
  }, [favoriteIds, t]);
}
