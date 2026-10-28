import { useEffect, useState } from 'react';

export type Persistence<T> = {
  load: () => Promise<T>;
  save: (value: T) => Promise<void>;
  /** Combines the stored value with changes made while it was being read. */
  merge: (stored: T, current: T) => T;
};

/**
 * State kept in storage. Nothing is written until the stored value has been
 * read, so a slow read can't be overwritten by the initial value. Pass a
 * `persistence` defined at module scope so its functions stay stable.
 */
export function usePersistedState<T>(
  initial: T | (() => T),
  { load, save, merge }: Persistence<T>,
) {
  const [value, setValue] = useState(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    load().then(
      stored => {
        if (!cancelled) {
          setValue(current => merge(stored, current));
          setHydrated(true);
        }
      },
      () => {
        // Unreadable storage: the state still works for this session, and
        // staying unhydrated means the unread data is never overwritten.
      },
    );
    return () => {
      cancelled = true;
    };
  }, [load, merge]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    save(value).catch(() => {
      // A failed write only loses this change after a restart; the next
      // change writes the whole value again.
    });
  }, [value, hydrated, save]);

  return [value, setValue] as const;
}
