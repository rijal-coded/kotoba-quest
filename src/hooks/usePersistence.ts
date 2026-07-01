import { useMemo } from 'react';
import { PersistenceAdapter, LocalStorageAdapter, IndexedDBAdapter } from '../services/persistence';

/**
 * Hook to get the appropriate persistence adapter based on environment/config.
 * Returns a singleton instance (adapters are stateless).
 */
export const usePersistence = (): PersistenceAdapter => {
  const adapter = useMemo<PersistenceAdapter>(() => {
    // Feature flag: VITE_USE_INDEXEDDB=true to use IndexedDB
    const useIndexedDB = import.meta.env.VITE_USE_INDEXEDDB === 'true';

    // You can also force a specific adapter via URL param for testing:
    // ?persistence=localStorage or ?persistence=indexeddb
    const urlParams = new URLSearchParams(window.location.search);
    const urlAdapter = urlParams.get('persistence');

    if (urlAdapter === 'localStorage') {
      console.log('[usePersistence] Using LocalStorageAdapter (URL override)');
      return new LocalStorageAdapter();
    }
    if (urlAdapter === 'indexeddb') {
      console.log('[usePersistence] Using IndexedDBAdapter (URL override)');
      return new IndexedDBAdapter();
    }

    if (useIndexedDB) {
      console.log('[usePersistence] Using IndexedDBAdapter (feature flag)');
      return new IndexedDBAdapter();
    }

    console.log('[usePersistence] Using LocalStorageAdapter (default)');
    return new LocalStorageAdapter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return adapter;
};
