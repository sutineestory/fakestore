import { useCallback, useState } from 'react';

import { useCart } from '@/features/cart';

/**
 * Cart state for one product. Adding to a full cart refuses and sets
 * `limitReached` so the screen can explain why.
 */
export function useAddToCart(id: number) {
  const { ids, isFull, add } = useCart();
  const [limitReached, setLimitReached] = useState(false);

  const addToCart = useCallback(() => {
    if (isFull) {
      setLimitReached(true);
      return;
    }
    add(id);
  }, [add, id, isFull]);

  const dismissLimit = useCallback(() => setLimitReached(false), []);

  return { inCart: ids.includes(id), addToCart, limitReached, dismissLimit };
}
