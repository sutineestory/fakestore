import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

type CartContextValue = {
  /** Product ids in the order they were added; each appears once. */
  ids: readonly number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = PropsWithChildren<{
  initialIds?: number[];
}>;

const EMPTY: readonly number[] = [];

export function CartProvider({ children, initialIds }: CartProviderProps) {
  const [ids, setIds] = useState<readonly number[]>(initialIds ?? EMPTY);

  const add = useCallback((id: number) => {
    setIds(current => (current.includes(id) ? current : [...current, id]));
  }, []);

  const remove = useCallback((id: number) => {
    setIds(current => current.filter(item => item !== id));
  }, []);

  const clear = useCallback(() => setIds(EMPTY), []);

  const value = useMemo<CartContextValue>(
    () => ({ ids, add, remove, clear }),
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
