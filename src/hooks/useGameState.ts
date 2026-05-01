import { useState, useEffect, useCallback } from 'react';
import { Page, Level, GameMode, Item, EndlessRecord } from '../types';
import { INITIAL_LEVELS, INITIAL_INVENTORY, MAX_INVENTORY_SLOTS } from '../constants';

// --- Safe localStorage helpers to guard against corrupted / missing data ---
const loadJson = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const loadInt = (key: string, fallback: number): number => {
  const saved = localStorage.getItem(key);
  const parsed = saved ? parseInt(saved, 10) : NaN;
  return isNaN(parsed) ? fallback : parsed;
};

// ---------------------------------------------------------------------------

export const useGameState = () => {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [pendingNav, setPendingNav] = useState<Page | null>(null);

  const [levels, setLevels] = useState<Level[]>(() => loadJson('kotoba_levels', INITIAL_LEVELS));
  const [inventory, setInventory] = useState<Item[]>(() => loadJson('kotoba_inventory', INITIAL_INVENTORY));
  const [username, setUsername] = useState<string>(() => localStorage.getItem('kotoba_username') ?? '');
  const [powerScore, setPowerScore] = useState<number>(() => loadInt('kotoba_power_score', 0));
  const [endlessRecords, setEndlessRecords] = useState<EndlessRecord[]>(() => loadJson('kotoba_endless_records', []));
  const [gameMode, setGameMode] = useState<GameMode>('LEARNING');

  // --- Persistence sync ---
  useEffect(() => { localStorage.setItem('kotoba_levels', JSON.stringify(levels)); }, [levels]);
  useEffect(() => { localStorage.setItem('kotoba_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('kotoba_power_score', powerScore.toString()); }, [powerScore]);
  useEffect(() => { localStorage.setItem('kotoba_endless_records', JSON.stringify(endlessRecords)); }, [endlessRecords]);

  // --- Navigation ---
  // Guard: if the player is in TANTANGAN battle, queue the nav request to prevent accidental exit
  const handleNavigate = useCallback((page: Page) => {
    if (currentPage === 'BATTLE' && gameMode === 'TANTANGAN' && selectedLevel) {
      setPendingNav(page);
      return;
    }
    setCurrentPage(page);
    // Clear selected level when leaving battle screens
    if (page !== 'BATTLE') {
      setSelectedLevel(null);
    }
  }, [currentPage, selectedLevel, gameMode]);

  const handleLevelSelect = useCallback((level: Level) => {
    setSelectedLevel(level);
    setCurrentPage('BATTLE');
  }, []);

  // Note: TANTANGAN mode uses direct level selection; no multi-level combination needed
  // handleStartEndless removed - replaced by direct level selection from LevelSelect

  // Handles all post-battle state updates atomically
  const handleBattleFinish = useCallback((
    victory: boolean,
    timeSpent: number,
    rewards?: Item[],
    scoreEarned: number = 0,
    enemiesBeaten?: number,
    wordsBeaten?: number,
    navigateTo?: Page
  ) => {
    const isTantangan = gameMode === 'TANTANGAN';

    // Update level progress for normal (LEARNING/PRACTICE) battles only
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

      if (rewards?.length) {
        setInventory(prev => {
          const next = [...prev];
          rewards.forEach(reward => {
            // Consumables: stack by id
            if (reward.type === 'CONSUMABLE') {
              const idx = next.findIndex(i => i.id === reward.id);
              if (idx >= 0 && next[idx].count !== undefined) {
                next[idx] = { ...next[idx], count: (next[idx].count ?? 0) + (reward.count ?? 1) };
                return;
              }
            } else {
              // Equipment: upgrade if same name/type already owned
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
                // Preserve equipped status
                next[existingIdx] = { ...existing, ...upgrades };
                return;
              }
            }

            // New item: enforce slot limit
            if (next.length >= MAX_INVENTORY_SLOTS) {
              console.warn('Inventory full, cannot add new item:', reward.name);
            } else {
              next.push({ ...reward });
            }
          });
          return next;
        });
      }
    }

    // Handle TANTANGAN (challenge mode) stats
    if (isTantangan) {
      if (enemiesBeaten !== undefined && wordsBeaten !== undefined) {
        setEndlessRecords(prev => [...prev, { date: Date.now(), enemiesBeaten, wordsBeaten }]);
      }
      setSelectedLevel(null);
      setPendingNav(null);
      setCurrentPage(navigateTo ?? 'LEVEL_SELECT'); // Return to level select for another challenge
    } else {
      setCurrentPage('LEVEL_SELECT');
    }
  }, [selectedLevel, gameMode]);

  const handleSetUsername = useCallback((name: string) => {
    setUsername(name);
    localStorage.setItem('kotoba_username', name);
  }, []);

  const handleResetData = useCallback(() => {
    setUsername('');
    setLevels(INITIAL_LEVELS);
    setInventory(INITIAL_INVENTORY);
    setPowerScore(0);
    setEndlessRecords([]);
    ['kotoba_username', 'kotoba_levels', 'kotoba_inventory', 'kotoba_power_score', 'kotoba_endless_records']
      .forEach(key => localStorage.removeItem(key));
  }, []);

  return {
    // State
    currentPage,
    selectedLevel,
    pendingNav,
    levels,
    inventory,
    username,
    powerScore,
    endlessRecords,
    gameMode,
    // Setters (only expose what App / pages need directly)
    setInventory,
    setGameMode,
    setPendingNav,
    // Handlers
    handleNavigate,
    handleLevelSelect,
    handleBattleFinish,
    handleSetUsername,
    handleResetData,
  };
};
