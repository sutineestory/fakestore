import {
  createContext,
  use,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from 'react';

import { usePersistedState, type Persistence } from '@/hooks';
import { loadCartIds, saveCartIds } from './services/cartStorage';

/** Most products the cart can hold. */
export const MAX_CART_ITEMS = 10;

type CartContextValue = {
  /** Product ids in the order they were added; each appears once. */
  ids: readonly number[];
  /** True once the cart holds `MAX_CART_ITEMS`; `add` then does nothing. */
  isFull: boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = PropsWithChildren<{
  initialIds?: number[];
}>;

const EMPTY: readonly number[] = [];

const PERSISTENCE: Persistence<readonly number[]> = {
  load: loadCartIds,
  save: saveCartIds,
  // Keep anything added while the read was in flight, after the saved items.
  merge: (stored, current) => [
    ...stored,
    ...current.filter(id => !stored.includes(id)),
  ],
};

export function CartProvider({ children, initialIds }: CartProviderProps) {
  const [ids, setIds] = usePersistedState<readonly number[]>(
    initialIds ?? EMPTY,
    PERSISTENCE,
  );

  const add = useCallback(
    (id: number) => {
      setIds(current =>
        current.includes(id) || current.length >= MAX_CART_ITEMS
          ? current
          : [...current, id],
      );
    },
    [setIds],
  );

  const remove = useCallback(
    (id: number) => {
      setIds(current => current.filter(item => item !== id));
    },
    [setIds],
  );

  const clear = useCallback(() => setIds(EMPTY), [setIds]);

  const value = useMemo<CartContextValue>(
    () => ({
      ids,
      isFull: ids.length >= MAX_CART_ITEMS,
      add,
      remove,
      clear,
    }),
    [ids, add, remove, clear],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = use(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>.');
  }
  return context;
}
