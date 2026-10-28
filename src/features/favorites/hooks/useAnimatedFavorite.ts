import { useCallback } from 'react';

import { useFavorite } from './useFavorite';
import { usePopAnimation } from './usePopAnimation';

/**
 * Favorite state for one item, with a heart scale that pops when it's added.
 * `beforeAdd` can veto adding (e.g. a full list); removing always goes ahead.
 */
export function useAnimatedFavorite(id: string, beforeAdd?: () => boolean) {
  const { isFavorite, toggle } = useFavorite(id);
  const { scale, pop } = usePopAnimation();

  const press = useCallback(() => {
    if (!isFavorite) {
      if (beforeAdd && !beforeAdd()) {
        return;
      }
      // Celebrate adding only; removing shouldn't feel like a reward.
      pop();
    }
    toggle();
  }, [beforeAdd, isFavorite, pop, toggle]);

  return { isFavorite, scale, press };
}
