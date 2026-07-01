import { PersistenceAdapter, GAME_STATE_KEYS, GameStateKey } from './PersistenceAdapter';

/**
 * LocalStorage adapter - synchronous operations wrapped in Promises for API compatibility.
 * Current default persistence mechanism.
 */
export class LocalStorageAdapter implements PersistenceAdapter {
  readonly name = 'localStorage';

  async load<T>(key: string, fallback: T): Promise<T> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[LocalStorageAdapter] Failed to load "${key}":`, error);
      return fallback;
    }
  }

  async save(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[LocalStorageAdapter] Failed to save "${key}":`, error);
      throw error; // Caller may want to handle quota errors
    }
  }

  async loadAll(): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    const keys = Object.values(GAME_STATE_KEYS);

    for (const key of keys) {
      try {
        const item = localStorage.getItem(key);
        result[key] = item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`[LocalStorageAdapter] Failed to load "${key}":`, error);
        result[key] = null;
      }
    }

    return result;
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.values(GAME_STATE_KEYS);
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('[LocalStorageAdapter] Failed to clear:', error);
      throw error;
    }
  }
}
