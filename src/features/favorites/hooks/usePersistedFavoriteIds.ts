import { usePersistedState, type Persistence } from '@/hooks';
import { loadFavoriteIds, saveFavoriteIds } from '../services/favoritesStorage';

const PERSISTENCE: Persistence<ReadonlySet<string>> = {
  load: async () => new Set(await loadFavoriteIds()),
  save: ids => saveFavoriteIds([...ids]),
  // Keep anything favorited while the read was in flight, newest last.
  merge: (stored, current) => new Set([...stored, ...current]),
};

/** Favorite ids kept in AsyncStorage across app restarts. */
export function usePersistedFavoriteIds(initialFavoriteIds?: string[]) {
  return usePersistedState<ReadonlySet<string>>(
    () => new Set(initialFavoriteIds),
    PERSISTENCE,
  );
}
