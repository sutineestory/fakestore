import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

type FavoritesContextValue = {
  favoriteIds: ReadonlySet<string>;
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = PropsWithChildren<{
  initialFavoriteIds?: string[];
}>;

export function FavoritesProvider({
  children,
  initialFavoriteIds,
}: FavoritesProviderProps) {
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(initialFavoriteIds),
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favoriteIds, toggleFavorite }),
    [favoriteIds, toggleFavorite],
  );

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

export function useFavorites(): FavoritesContextValue {
  const context = use(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>.');
  }
  return context;
}
