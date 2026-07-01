/**
 * Abstraction layer for game state persistence.
 * Allows swapping between localStorage (simple) and IndexedDB (scalable).
 */

export interface PersistenceAdapter {
  /**
   * Load a value from storage, with fallback if not found.
   * @param key - Storage key
   * @param fallback - Default value if key doesn't exist
   */
  load<T>(key: string, fallback: T): Promise<T>;

  /**
   * Save a value to storage.
   * @param key - Storage key
   * @param data - Value to save (will be serialized)
   */
  save(key: string, data: any): Promise<void>;

  /**
   * Load all known game state keys.
   * Useful for initial hydration.
   */
  loadAll(): Promise<Record<string, any>>;

  /**
   * Clear all stored data.
   * Use cautiously (e.g., logout, reset game).
   */
  clear(): Promise<void>;

  /**
   * Get the adapter name (for debugging/logging).
   */
  readonly name: string;
}

// Common game state keys (keep in sync throughout codebase)
export const GAME_STATE_KEYS = {
  LEVELS: 'levels',
  INVENTORY: 'inventory',
  USERNAME: 'username',
  STRENGTH: 'strength',
  ENDLESS_RECORDS: 'endless_records',
  THEME: 'theme',
  SAKURA_PETALS: 'sakura_petals',
} as const;

export type GameStateKey = typeof GAME_STATE_KEYS[keyof typeof GAME_STATE_KEYS];
