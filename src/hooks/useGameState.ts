import { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Level, GameMode, Item, EndlessRecord } from '../types';
import { INITIAL_LEVELS, INITIAL_INVENTORY, MAX_INVENTORY_SLOTS } from '../constants';
import { usePersistence } from './usePersistence';
import { GAME_STATE_KEYS } from '../services/persistence/PersistenceAdapter';

// -----------------------------------------------------------------------------
// Default empty states (used before hydration completes)
// -----------------------------------------------------------------------------

const emptyEndlessRecords: EndlessRecord[] = [];

// -----------------------------------------------------------------------------
// Helper: ensure array exists (for failed hydration)
// -----------------------------------------------------------------------------
const ensureArray = <T>(value: T | null | undefined, fallback: T[]): T[] => {
  return Array.isArray(value) ? value : fallback;
};

// -----------------------------------------------------------------------------
// Main Hook
// -----------------------------------------------------------------------------

export const useGameState = () => {
  const persistence = usePersistence();

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);
  const [hydrateError, setHydrateError] = useState<Error | null>(null);

  // Game state - initial values are defaults (overridden after hydration)
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [pendingNav, setPendingNav] = useState<Page | null>(null);

  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);
  const [inventory, setInventory] = useState<Item[]>(INITIAL_INVENTORY);
  const [username, setUsername] = useState<string>('');
  const [powerScore, setPowerScore] = useState<number>(0);
  const [endlessRecords, setEndlessRecords] = useState<EndlessRecord[]>(emptyEndlessRecords);
  const [gameMode, setGameMode] = useState<GameMode>('LEARNING');

  // Ref to access latest state without re-creating callbacks
  const stateRef = useRef({
    currentPage,
    selectedLevel,
    gameMode,
    inventory,
  });

  useEffect(() => {
    stateRef.current = {
      currentPage,
      selectedLevel,
      gameMode,
      inventory,
    };
  }, [currentPage, selectedLevel, gameMode, inventory]);

  // ---------------------------------------------------------------------------
  // Hydration: Load all game state on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const data = await persistence.loadAll();

        if (!mounted) return;

        // Apply loaded data with fallback to defaults if null/undefined
        const loadedLevels = data[GAME_STATE_KEYS.LEVELS] ?? INITIAL_LEVELS;
        const loadedInventory = data[GAME_STATE_KEYS.INVENTORY] ?? INITIAL_INVENTORY;
        const loadedUsername = data[GAME_STATE_KEYS.USERNAME] ?? '';
        const loadedPowerScore = data[GAME_STATE_KEYS.POWER_SCORE] ?? 0;
        const loadedEndlessRecords = ensureArray(data[GAME_STATE_KEYS.ENDLESS_RECORDS], emptyEndlessRecords);

        setLevels(loadedLevels);
        setInventory(loadedInventory);
        setUsername(loadedUsername);
        setPowerScore(loadedPowerScore);
        setEndlessRecords(loadedEndlessRecords);
        // gameMode stays at default LEARNING initially; we don't persist it

        setIsHydrated(true);
      } catch (error) {
        console.error('[useGameState] Hydration failed:', error);
        if (mounted) {
          setHydrateError(error instanceof Error ? error : new Error('Failed to load game data'));
          setIsHydrated(true); // Still mark as hydrated to show UI (with defaults)
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [persistence]);

  // ---------------------------------------------------------------------------
  // Persistence: Batched writes (debounced 500ms)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isHydrated) return; // Don't write before hydration completes

    const timeoutId = setTimeout(async () => {
      try {
        await Promise.all([
          persistence.save(GAME_STATE_KEYS.LEVELS, levels),
          persistence.save(GAME_STATE_KEYS.INVENTORY, inventory),
          persistence.save(GAME_STATE_KEYS.POWER_SCORE, powerScore),
          persistence.save(GAME_STATE_KEYS.ENDLESS_RECORDS, endlessRecords),
        ]);
      } catch (error) {
        console.error('[useGameState] Persistence save failed:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isHydrated, persistence, levels, inventory, powerScore, endlessRecords]);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const handleNavigate = useCallback((page: Page) => {
    const { currentPage, selectedLevel, gameMode } = stateRef.current;
    if (currentPage === 'BATTLE' && gameMode === 'TANTANGAN' && selectedLevel) {
      setPendingNav(page);
      return;
    }
    setCurrentPage(page);
    if (page !== 'BATTLE') {
      setSelectedLevel(null);
    }
  }, [setPendingNav, setCurrentPage, setSelectedLevel]);

  const handleLevelSelect = useCallback((level: Level) => {
    setSelectedLevel(level);
    setCurrentPage('BATTLE');
  }, []);

  // ---------------------------------------------------------------------------
  // Battle finish handler
  // ---------------------------------------------------------------------------
  const handleBattleFinish = useCallback(
    (
      victory: boolean,
      timeSpent: number,
      rewards?: Item[],
      scoreEarned: number = 0,
      enemiesBeaten?: number,
      wordsBeaten?: number,
      navigateTo?: Page,
      currentInventory?: Item[]
    ) => {
      const { selectedLevel, gameMode, inventory: globalInventory } = stateRef.current;
      const isTantangan = gameMode === 'TANTANGAN';

      if (selectedLevel && !isTantangan) {
        setLevels(prev => prev.map(l => {
          if (l.id !== selectedLevel.id) return l;
          const newUnlocked = victory ? Math.min(l.words.length, l.unlockedWordCount + 5) : l.unlockedWordCount;
          return {
            ...l,
            isCompleted: victory ? true : l.isCompleted,
            bestTime: victory ? (l.bestTime === 0 ? timeSpent : Math.min(l.bestTime, timeSpent)) : l.bestTime,
            unlockedWordCount: newUnlocked
          };
        }));
      }

      if (victory) {
        setPowerScore(prev => prev + scoreEarned);
      }

      if (currentInventory !== undefined) {
        let finalInventory = currentInventory;
        if (victory && rewards?.length) {
          finalInventory = [...currentInventory];
          rewards.forEach(reward => {
            if (reward.type === 'CONSUMABLE') {
              const idx = finalInventory.findIndex(i => i.id === reward.id);
              if (idx >= 0 && finalInventory[idx].count !== undefined) {
                finalInventory[idx] = { ...finalInventory[idx], count: (finalInventory[idx].count ?? 0) + (reward.count ?? 1) };
                return;
              }
            } else {
              const existingIdx = finalInventory.findIndex(i => i.name === reward.name && i.type === reward.type);
              if (existingIdx >= 0) {
                const existing = finalInventory[existingIdx];
                const upgrades: Partial<Item> = {};
                if (reward.type === 'WEAPON' && existing.attackBonus !== undefined) {
                  upgrades.attackBonus = existing.attackBonus + 5;
                }
                if (reward.type === 'SHIELD' && existing.defenseBonus !== undefined) {
                  upgrades.defenseBonus = existing.defenseBonus + 3;
                }
                finalInventory[existingIdx] = { ...existing, ...upgrades };
                return;
              }
            }
            if (finalInventory.length >= MAX_INVENTORY_SLOTS) {
              console.warn('Inventory full, cannot add new item:', reward.name);
            } else {
              finalInventory.push({ ...reward });
            }
          });
        }
        setInventory(finalInventory);
      } else if (victory && rewards?.length) {
        setInventory(prev => {
          const next = [...globalInventory];
          rewards.forEach(reward => {
            if (reward.type === 'CONSUMABLE') {
              const idx = next.findIndex(i => i.id === reward.id);
              if (idx >= 0 && next[idx].count !== undefined) {
                next[idx] = { ...next[idx], count: (next[idx].count ?? 0) + (reward.count ?? 1) };
                return;
              }
            } else {
              const existingIdx = next.findIndex(i => i.name === reward.name && i.type === reward.type);
              if (existingIdx >= 0) {
                const existing = next[existingIdx];
                const upgrades: Partial<Item> = {};
                if (reward.type === 'WEAPON' && existing.attackBonus !== undefined) {
                  upgrades.attackBonus = existing.attackBonus + 5;
                }
                if (reward.type === 'SHIELD' && existing.defenseBonus !== undefined) {
                  upgrades.defenseBonus = existing.defenseBonus + 3;
                }
                next[existingIdx] = { ...existing, ...upgrades };
                return;
              }
            }
            if (next.length >= MAX_INVENTORY_SLOTS) {
              console.warn('Inventory full, cannot add new item:', reward.name);
            } else {
              next.push({ ...reward });
            }
          });
          return next;
        });
      }

      if (isTantangan) {
        if (enemiesBeaten !== undefined && wordsBeaten !== undefined) {
          setEndlessRecords(prev => [...prev, { date: Date.now(), enemiesBeaten, wordsBeaten }]);
        }
        setSelectedLevel(null);
        setPendingNav(null);
        setCurrentPage(navigateTo ?? 'LEVEL_SELECT');
      } else {
        setCurrentPage('LEVEL_SELECT');
      }
    },
    [setLevels, setPowerScore, setInventory, setEndlessRecords, setCurrentPage, setSelectedLevel, setPendingNav]
  );

  const handleSetUsername = useCallback((name: string) => {
    setUsername(name);
  }, []);

  const handleResetData = useCallback(() => {
    // Reset all state to defaults
    setLevels(INITIAL_LEVELS);
    setInventory(INITIAL_INVENTORY);
    setUsername('');
    setPowerScore(0);
    setEndlessRecords(emptyEndlessRecords);
    setGameMode('LEARNING');
    setCurrentPage('HOME');
    setSelectedLevel(null);
    setPendingNav(null);
    // Clear persistence
    persistence.clear().catch(console.error);
  }, [persistence]);

  // Persistence: Save username separately (immediate, not debounced) - using persistence
  useEffect(() => {
    if (!isHydrated) return;
    persistence.save(GAME_STATE_KEYS.USERNAME, username).catch(console.error);
  }, [isHydrated, persistence, username]);

  return {
    // Hydration status
    isHydrated,
    hydrateError,
    // State
    currentPage,
    setCurrentPage,
    selectedLevel,
    setSelectedLevel,
    pendingNav,
    setPendingNav,
    levels,
    setLevels,
    inventory,
    setInventory,
    username,
    setUsername,
    powerScore,
    setPowerScore,
    endlessRecords,
    setEndlessRecords,
    gameMode,
    setGameMode,
    // Actions
    handleNavigate,
    handleLevelSelect,
    handleBattleFinish,
    handleSetUsername,
    handleResetData,
  };
};
