import { useEffect, useState } from 'react';

import { loadFavoriteIds, saveFavoriteIds } from '../services/favoritesStorage';

/**
 * Favorite ids kept in AsyncStorage. Nothing is written until the saved ids
 * have been read, so a slow read can't be overwritten by an empty list.
 */
export function usePersistedFavoriteIds(initialFavoriteIds?: string[]) {
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(initialFavoriteIds),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadFavoriteIds().then(
      stored => {
        if (!cancelled) {
          // Keep anything favorited while the read was in flight, newest last.
          setFavoriteIds(current => new Set([...stored, ...current]));
          setHydrated(true);
        }
      },
      () => {
        // Unreadable storage: favorites still work for this session, and
        // staying unhydrated means the unread data is never overwritten.
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveFavoriteIds([...favoriteIds]).catch(() => {
      // A failed write only loses this change after a restart; the next
      // change writes the whole list again.
    });
  }, [favoriteIds, hydrated]);

  return [favoriteIds, setFavoriteIds] as const;
}
