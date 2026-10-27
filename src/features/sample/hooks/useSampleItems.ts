import { useCallback, useEffect, useState } from 'react';

import { fetchSampleItems } from '../services/sampleService';
import type { SampleItem } from '../types';

export type SampleItemsState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; items: SampleItem[] };

const LOADING: SampleItemsState = { status: 'loading' };

/**
 * Loads the sample items. `retry` clears the list and shows the loading
 * state again; `refresh` keeps the current list on screen while it reloads.
 */
export function useSampleItems() {
  const [state, setState] = useState<SampleItemsState>(LOADING);
  const [refreshing, setRefreshing] = useState(false);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    // Ignore responses that land after unmount or after a newer request.
    let stale = false;
    fetchSampleItems().then(
      items => {
        if (!stale) {
          setState({ status: 'success', items });
          setRefreshing(false);
        }
      },
      (error: unknown) => {
        if (!stale) {
          setState({ status: 'error', error });
          setRefreshing(false);
        }
      },
    );
    return () => {
      stale = true;
    };
  }, [requestId]);

  const retry = useCallback(() => {
    setState(LOADING);
    setRequestId(id => id + 1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setRequestId(id => id + 1);
  }, []);

  return { state, refreshing, retry, refresh };
}
