export type Page = 'HOME' | 'MODE_SELECT' | 'BATTLE' | 'INVENTORY' | 'LEVEL_SELECT' | 'ABOUT' | 'EXPERIMENTAL_BATTLE';

export type GameMode = 'LEARNING' | 'PRACTICE' | 'TANTANGAN';

export interface Word {
  japanese: string;
  kanji?: string;
  indonesian: string;
  romaji: string;
}

export interface Level {
  id: string;
  name: string;
  icon: string;
  words: Word[];
  isCompleted: boolean;
  bestTime: number;
  unlockedWordCount: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'WEAPON' | 'SHIELD' | 'ACCESSORY' | 'CONSUMABLE';
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  effect?: string;
  count?: number;
  attackBonus?: number;
  defenseBonus?: number;
  hpBonus?: number;
  isEquipped?: boolean;
}

export interface GameState {
  playerHP: number;
  maxPlayerHP: number;
  enemyHP: number;
  maxEnemyHP: number;
  currentLevel: Level | null;
  currentWordIndex: number;
  score: number;
  wordsBeaten: number;
  enemiesBeaten: number;
  inventory: Item[];
  equipped: {
    weapon: Item | null;
    shield: Item | null;
    accessory: Item | null;
  };
}

export interface EndlessRecord {
  date: number;
  enemiesBeaten: number;
  wordsBeaten: number;
}
