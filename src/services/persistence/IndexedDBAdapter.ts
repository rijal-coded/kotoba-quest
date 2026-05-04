import { PersistenceAdapter, GAME_STATE_KEYS, GameStateKey } from './PersistenceAdapter';

/**
 * IndexedDB adapter - asynchronous, scalable persistence.
 * Uses a single object store "game-state" with key-value pairs.
 */
export class IndexedDBAdapter implements PersistenceAdapter {
  readonly name = 'indexedDB';
  private static DB_NAME = 'kotoba-quest-v1';
  private static STORE_NAME = 'game-state';
  private static DB_VERSION = 1;

  private db: IDBDatabase | null = null;
  private connectionPromise: Promise<IDBDatabase> | null = null;

  /**
   * Connect to IndexedDB, creating database/object store if needed.
   * Uses a singleton connection (lazy init).
   */
  private async connect(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(IndexedDBAdapter.DB_NAME, IndexedDBAdapter.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IndexedDBAdapter.STORE_NAME)) {
          db.createObjectStore(IndexedDBAdapter.STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error('[IndexedDBAdapter] Connection failed:', error);
        this.connectionPromise = null;
        reject(error);
      };
    });

    return this.connectionPromise;
  }

  /**
   * Auto-migration: If IndexedDB is empty, migrate from localStorage.
   * This is a one-time operation on first initialization.
   */
  private async migrateFromLocalStorageIfNeeded(): Promise<void> {
    try {
      const db = await this.connect();
      const store = db.transaction(IndexedDBAdapter.STORE_NAME, 'readonly').objectStore(IndexedDBAdapter.STORE_NAME);
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        const count = countRequest.result;
        if (count === 0) {
          console.log('[IndexedDBAdapter] Empty DB, migrating from localStorage...');
          this.migrateFromLocalStorage();
        }
      };
    } catch (error) {
      console.error('[IndexedDBAdapter] Migration check failed:', error);
    }
  }

  private async migrateFromLocalStorage(): Promise<void> {
    const keys = Object.values(GAME_STATE_KEYS);
    const tx = (await this.connect()).transaction(IndexedDBAdapter.STORE_NAME, 'readwrite');
    const store = tx.objectStore(IndexedDBAdapter.STORE_NAME);

    for (const key of keys) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          store.put(JSON.parse(item), key);
        } catch (error) {
          console.warn(`[IndexedDBAdapter] Failed to migrate key "${key}":`, error);
        }
      }
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log('[IndexedDBAdapter] Migration complete.');
        resolve();
      };
      tx.onerror = () => {
        console.error('[IndexedDBAdapter] Migration failed:', tx.error);
        reject(tx.error);
      };
    });
  }

  async load<T>(key: string, fallback: T): Promise<T> {
    try {
      const db = await this.connect();
      // Ensure migration runs at least once (lazy)
      await this.migrateFromLocalStorageIfNeeded();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(IndexedDBAdapter.STORE_NAME, 'readonly');
        const store = tx.objectStore(IndexedDBAdapter.STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          const value = request.result;
          if (value !== undefined) {
            resolve(value as T);
          } else {
            resolve(fallback);
          }
        };
        request.onerror = () => {
          console.error(`[IndexedDBAdapter] Load error for "${key}":`, request.error);
          resolve(fallback); // Fail gracefully
        };
      });
    } catch (error) {
      console.error(`[IndexedDBAdapter] Unexpected load error for "${key}":`, error);
      return fallback;
    }
  }

  async save(key: string, data: any): Promise<void> {
    try {
      const db = await this.connect();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IndexedDBAdapter.STORE_NAME, 'readwrite');
        const store = tx.objectStore(IndexedDBAdapter.STORE_NAME);
        store.put(data, key);

        tx.oncomplete = () => resolve();
        tx.onerror = () => {
          console.error(`[IndexedDBAdapter] Save error for "${key}":`, tx.error);
          reject(tx.error);
        };
      });
    } catch (error) {
      console.error(`[IndexedDBAdapter] Unexpected save error for "${key}":`, error);
      throw error;
    }
  }

  async loadAll(): Promise<Record<string, any>> {
    const keys = Object.values(GAME_STATE_KEYS);
    const results: Record<string, any> = {};

    // Parallel loads for speed
    await Promise.all(
      keys.map(async key => {
        results[key] = await this.load(key, null);
      })
    );

    return results;
  }

  async clear(): Promise<void> {
    try {
      const db = await this.connect();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IndexedDBAdapter.STORE_NAME, 'readwrite');
        const store = tx.objectStore(IndexedDBAdapter.STORE_NAME);
        store.clear();

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      console.error('[IndexedDBAdapter] Clear error:', error);
      throw error;
    }
  }
}
