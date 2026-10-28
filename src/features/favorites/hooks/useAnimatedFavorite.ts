import { useCallback } from 'react';

import { useFavorite } from './useFavorite';
import { usePopAnimation } from './usePopAnimation';

/** Favorite state for one item, with a heart scale that pops when it's added. */
export function useAnimatedFavorite(id: string) {
  const { isFavorite, toggle } = useFavorite(id);
  const { scale, pop } = usePopAnimation();

  const press = useCallback(() => {
    // Celebrate adding only; removing shouldn't feel like a reward.
    if (!isFavorite) {
      pop();
    }
    toggle();
  }, [isFavorite, pop, toggle]);

  return { isFavorite, scale, press };
}
